import Link from "next/link";
import Image from "next/image";
import { Menu, X, FileUser, MessageCircle, LayoutDashboard, Search, History } from "lucide-react";
import { Session } from "next-auth";
import { SessionUser } from "@/types/navigation";
import Logo from "../../public/AusLeap.png";
import { STATIC_LINKS } from "@/utils/constants/navigation";
import { UserMenu } from "./UserMenu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TopBarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  showNav: boolean;
  isAuthPath: boolean;
  isProtectedPath: boolean;
  isResetPasswordPath: boolean;
  session: Session | null;
  totalUnreadCount: number;
}

export function TopBar({
  isMenuOpen,
  setIsMenuOpen,
  showNav,
  isAuthPath,
  isProtectedPath,
  isResetPasswordPath,
  session,
  totalUnreadCount,
}: TopBarProps) {
  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  if (isResetPasswordPath) {
    return (
      <div className="bg-black text-white py-2 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Image
              src={Logo}
              alt="iLEAP Logo"
              width={80}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <Link
            href="/signin"
            className="text-sm font-normal hover:text-blue-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (!showNav) return null;

  return (
    <div className="bg-black text-white py-2 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <button
            id="hamburger-button"
            className="md:hidden text-white focus:outline-none"
            onClick={handleMenuToggle}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link
            href={
              session
                ? session.user?.role === "organization"
                  ? "/organization"
                  : "/volunteer"
                : "/"
            }
            className="flex items-center"
          >
            <Image
              src={Logo}
              alt="iLEAP Logo"
              width={80}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          {session?.user?.role === "organization" && isProtectedPath && (
            <>
              <Link
                href="/organization/dashboard"
                className="text-xs flex items-center gap-2 py-[6px] px-3 bg-[#343434] rounded-md font-medium hover:text-blue-500 hidden md:flex"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link
                href="/organization/opportunities"
                className="text-xs flex items-center gap-2 py-[6px] px-3 bg-[#343434] rounded-md font-medium hover:text-blue-500 hidden md:flex"
              >
                <FileUser className="h-4 w-4" /> Opportunities
              </Link>
            </>
          )}
        </div>

        {isAuthPath ? (
          <div className="flex items-center space-x-4">
            {session ? (
              <UserMenu user={session.user as SessionUser} />
            ) : (
              <Link
                href="/signup"
                className="text-sm font-normal hover:text-blue-500"
              >
                Sign up
              </Link>
            )}
          </div>
        ) : isProtectedPath ? (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {session?.user?.role === "organization" && (
                <SearchBar />
              )}
              <Link
                href={`/${
                  session?.user?.role === "organization"
                    ? "organisation"
                    : session?.user?.role
                }/messages`}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800 transition-colors relative"
              >
                <MessageCircle className="h-6 w-6" />
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalUnreadCount}
                  </span>
                )}
              </Link>
              {session?.user && (
                <UserMenu user={session.user as SessionUser} />
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-6">
            {STATIC_LINKS.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm font-medium hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("opportunity");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [overlay, setOverlay] = useState(false);
  const suggestions = [
    "illustrator",
    "childrens book illustrator",
    "graphic designer illustrator",
    "adobe illustrator",
    "medical illustrator"
  ];
  const filtered = query
    ? suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      router.push(`/search?type=${type}&q=${encodeURIComponent(query)}`);
      setShowDropdown(false);
      setOverlay(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowDropdown(true);
    setHighlighted(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      setHighlighted(h => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (highlighted >= 0 && filtered[highlighted]) {
        setQuery(filtered[highlighted]);
        setShowDropdown(false);
        setOverlay(false);
        router.push(`/search?type=${type}&q=${encodeURIComponent(filtered[highlighted])}`);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setOverlay(false);
    }
  };

  // Overlay search bar
  if (overlay) {
    return (
      <>
        {/* Dimmed background */}
        <div className="fixed inset-0 h-[100vh] z-40 bg-black/40" onClick={() => { setOverlay(false); setShowDropdown(false); }} />
        {/* Top white bar overlay */}
        <div className="fixed top-0 left-0 w-full h-[80px] bg-white z-50 flex items-center px-0" style={{ boxShadow: 'none', borderRadius: 0, border: 'none' }}>
          {/* Logo */}
          <div className="flex items-center h-full pl-16 select-none" style={{ minWidth: 180 }}>
            <Image src={Logo} alt="Logo" width={120} height={40} className="h-10 w-auto" priority />
          </div>
          {/* Search input and X in a single flex row */}
          <div className="relative flex-1 h-full flex items-center" style={{ minWidth: 0 }}>
            <form
              onSubmit={handleSearch}
              className="w-full h-full flex items-center"
              autoComplete="off"
              style={{ boxShadow: "none" }}
            >
              <div className="relative w-full flex items-center" style={{ minWidth: 0 }}>
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <Search className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  placeholder="Search for talent"
                  value={query}
                  onChange={handleInput}
                  autoFocus
                  className="w-full pl-10 pr-4 pb-2 text-[20px] font-normal border-0 border-b-2 border-black focus:ring-0 focus:border-black placeholder:text-gray-400 bg-transparent outline-none"
                  style={{ background: 'transparent', height: 40, borderRadius: 0, boxShadow: 'none' }}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
                {/* Close button flush right */}
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-black hover:text-gray-600 focus:outline-none z-50"
                  onClick={() => { setOverlay(false); setShowDropdown(false); }}
                  aria-label="Close search"
                  style={{ fontSize: 28, background: 'none', border: 'none', padding: 0 }}
                >
                  <X className="h-7 w-7" />
                </button>
              </div>
            </form>
            {/* Suggestions absolutely positioned under input underline */}
            {showDropdown && filtered.length > 0 && (
              <div className="absolute left-0 top-[48px] w-full bg-white z-50" style={{ minWidth: 0 }}>
                <ul className="mt-3 space-y-2">
                  {filtered.map((s, i) => (
                    <li
                      key={s}
                      className={`flex items-center pl-2 pr-4 py-1 cursor-pointer text-[16px] transition-colors ${highlighted === i ? "bg-gray-100" : "hover:bg-gray-50"}`}
                      onMouseDown={() => {
                        setQuery(s);
                        setShowDropdown(false);
                        setOverlay(false);
                        router.push(`/search?type=${type}&q=${encodeURIComponent(s)}`);
                      }}
                      onMouseEnter={() => setHighlighted(i)}
                      aria-selected={highlighted === i}
                      style={{ color: '#222', fontWeight: 400 }}
                    >
                      <History className="h-5 w-5 mr-3 text-gray-500" />
                      <span className="text-black font-normal">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Default compact search bar
  return (
    <div className="relative hidden md:flex h-[40px] items-center rounded-md border border-input bg-background w-[340px] overflow-visible group focus-within:ring-2 focus-within:ring-blue-500" style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,.05)" }}>
      <form
        onSubmit={handleSearch}
        className="flex flex-1 items-center h-full"
        autoComplete="off"
      >
        <span className="pl-3 flex items-center text-muted-foreground">
          <button
            type="button"
            className="focus:outline-none hover:text-blue-600 transition-colors"
            tabIndex={-1}
            onClick={() => setOverlay(true)}
          >
            <Search className="h-4 w-4" />
          </button>
        </span>
        <Input
          type="text"
          placeholder="Search"
          value={query}
          onChange={handleInput}
          onFocus={() => setOverlay(true)}
          className="border-none bg-transparent focus:ring-0 focus-visible:ring-0 px-2 text-sm flex-1 placeholder:text-muted-foreground cursor-pointer"
          style={{ boxShadow: "none" }}
          readOnly
        />
        <Separator orientation="vertical" className="mx-2 h-6" />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[110px] px-2 text-sm rounded-none focus:ring-0 focus-visible:ring-0 border-none bg-transparent">
            <SelectValue placeholder="Jobs" />
          </SelectTrigger>
          <SelectContent align="end" className="min-w-[110px]">
            <SelectItem value="volunteer">Talent</SelectItem>
            <SelectItem value="opportunity">Jobs</SelectItem>
          </SelectContent>
        </Select>
      </form>
    </div>
  );
} 
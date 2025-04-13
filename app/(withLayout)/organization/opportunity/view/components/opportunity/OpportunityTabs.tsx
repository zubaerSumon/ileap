import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  Search } from "lucide-react";
import { PostContent } from "./PostContent";
import { RecruitsContent } from "./RecruitsContent";
import { Sidebar } from "./Sidebar";
import { ReviewContent } from "./ReviewContent";

export function OpportunityTabs() {
  return (
    <Tabs defaultValue="post" className="mb-8">
      <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-full h-12">
        <TabsTrigger 
          value="post" 
          className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD] flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
            <path d="M10.1693 1.33301H4.16927C3.81565 1.33301 3.47651 1.47348 3.22646 1.72353C2.97641 1.97358 2.83594 2.31272 2.83594 2.66634V13.333C2.83594 13.6866 2.97641 14.0258 3.22646 14.2758C3.47651 14.5259 3.81565 14.6663 4.16927 14.6663H12.1693C12.5229 14.6663 12.862 14.5259 13.1121 14.2758C13.3621 14.0258 13.5026 13.6866 13.5026 13.333V4.66634L10.1693 1.33301Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.5 1.33301V3.99967C9.5 4.3533 9.64048 4.69244 9.89052 4.94248C10.1406 5.19253 10.4797 5.33301 10.8333 5.33301H13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.5 8.66699H6.83333" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.5 8.66699H10.8333" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.5 11.333H6.83333" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.5 11.333H10.8333" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Post Details
        </TabsTrigger>
        <TabsTrigger 
          value="review" 
          className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD] flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6.66536 6.33301L5.33203 7.99967L6.66536 9.66634" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.33203 6.33301L10.6654 7.99967L9.33203 9.66634" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.26536 13.3337C6.53775 13.9864 8.00142 14.1632 9.39262 13.8322C10.7838 13.5012 12.0111 12.6842 12.8532 11.5285C13.6953 10.3727 14.097 8.95416 13.9858 7.52846C13.8745 6.10277 13.2578 4.76367 12.2466 3.75249C11.2354 2.7413 9.89629 2.12452 8.47059 2.0133C7.04489 1.90208 5.62635 2.30372 4.47058 3.14585C3.31481 3.98799 2.49783 5.21523 2.16685 6.60643C1.83587 7.99763 2.01266 9.46131 2.66536 10.7337L1.33203 14.667L5.26536 13.3337Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Review Application (Short Listed)
        </TabsTrigger>
        <TabsTrigger 
          value="recruits" 
          className="rounded-full transition-colors data-[state=active]:bg-[#246BFD] data-[state=active]:text-white hover:bg-gray-200 data-[state=active]:hover:bg-[#246BFD] flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
            <path d="M12.3346 7.33366V4.00033C12.3346 3.6467 12.1942 3.30756 11.9441 3.05752C11.6941 2.80747 11.3549 2.66699 11.0013 2.66699C10.6477 2.66699 10.3085 2.80747 10.0585 3.05752C9.80844 3.30756 9.66797 3.6467 9.66797 4.00033" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.67057 6.66634V2.66634C9.67057 2.31272 9.5301 1.97358 9.28005 1.72353C9.03 1.47348 8.69086 1.33301 8.33724 1.33301C7.98362 1.33301 7.64448 1.47348 7.39443 1.72353C7.14438 1.97358 7.00391 2.31272 7.00391 2.66634V3.99967" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.0026 7.00033V4.00033C7.0026 3.6467 6.86213 3.30756 6.61208 3.05752C6.36203 2.80747 6.02289 2.66699 5.66927 2.66699C5.31565 2.66699 4.97651 2.80747 4.72646 3.05752C4.47641 3.30756 4.33594 3.6467 4.33594 4.00033V9.33366" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.3347 5.33333C12.3347 4.97971 12.4752 4.64057 12.7252 4.39052C12.9753 4.14048 13.3144 4 13.668 4C14.0217 4 14.3608 4.14048 14.6108 4.39052C14.8609 4.64057 15.0014 4.97971 15.0014 5.33333V9.33333C15.0014 10.7478 14.4395 12.1044 13.4393 13.1046C12.4391 14.1048 11.0825 14.6667 9.66804 14.6667H8.3347C6.46804 14.6667 5.3347 14.0933 4.34137 13.1067L1.94137 10.7067C1.71199 10.4526 1.5891 10.1201 1.59812 9.77796C1.60714 9.43581 1.7474 9.11023 1.98985 8.86864C2.2323 8.62705 2.55837 8.48794 2.90055 8.48013C3.24273 8.47232 3.57481 8.59639 3.82804 8.82667L5.00137 10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Recruits
        </TabsTrigger>
      </TabsList>

      <TabsContent value="post" className="mt-6">
        <div className="flex gap-8">
          <PostContent />
          <div className="w-[1px] bg-gray-200"></div>
          <Sidebar />
        </div>
      </TabsContent>

      <TabsContent value="recruits" className="mt-6">
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="flex justify-between gap-3">
              <div className="relative max-w-[333px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input 
                  placeholder="Search volunteers" 
                  className="pl-10 bg-gray-50 border-0"
                />
              </div>
              <Button 
                variant="outline" 
                className="h-10 px-4 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path d="M13.9987 3.16699H9.33203" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.66667 3.16699H2" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 8.5H8" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.33333 8.5H2" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14.0013 13.833H10.668" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 13.833H2" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.33203 1.83301V4.49967" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.33203 7.16699V9.83366" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.668 12.5V15.1667" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Filter
              </Button>
            </div>
            <div className="w-full border-b border-[#F1F1F1]" />
          </div>
          <RecruitsContent />
        </div>
      </TabsContent>

      <TabsContent value="review" className="mt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex gap-8 text-sm">
              <button className="text-[#246BFD] border-b-2 border-[#246BFD]">
                All (15)
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                Saved (2)
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                Messaged (3)
              </button>
            </div>
            <div className="w-full border-b border-[#F1F1F1]" />
            <div className="flex justify-between gap-3 ">
              <div className="relative max-w-[333px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input 
                  placeholder="Search volunteers" 
                  className="pl-10 bg-gray-50 border-0"
                />
              </div>
              <Button 
                variant="outline" 
                className="h-10 px-4 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path d="M13.9987 3.16699H9.33203" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.66667 3.16699H2" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 8.5H8" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.33333 8.5H2" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14.0013 13.833H10.668" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 13.833H2" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.33203 1.83301V4.49967" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.33203 7.16699V9.83366" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.668 12.5V15.1667" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Filter
              </Button>
            </div>
          </div>
          <ReviewContent />
        </div>
      </TabsContent>
    </Tabs>
  );
}
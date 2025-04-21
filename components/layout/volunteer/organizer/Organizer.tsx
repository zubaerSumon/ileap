interface OrganizerProps {
  organizerId: string;
}

export default function Organizer({ organizerId }: OrganizerProps) {
  // Use organizerId to determine what content to display
  if (organizerId === "clean-up-australia") {
    return (
      <div className="max-w-[1280px] mx-auto px-4 mb-8 pt-20">
        <h1 className="text-3xl font-bold mb-4">Clean Up Australia</h1>
        <p className="text-gray-700">
          Clean Up Australia is dedicated to protecting and preserving the environment by organizing clean-up events across the country. Join us in making a difference!
        </p>
        {/* Add more details specific to Clean Up Australia */}
      </div>
    );
  }

  if (organizerId === "easy-care-gardening") {
    return (
      <div className="max-w-[1280px] mx-auto px-4 mb-8 pt-20">
        <h1 className="text-3xl font-bold mb-4">Easy Care Gardening</h1>
        <p className="text-gray-700">
          Easy Care Gardening is a volunteer-based gardening service that helps senior Australians maintain their homes. Teams of volunteers weed, prune, mulch to make gardens safe and tidy, with the aim of keeping people in their own homes for longer.
        </p>
        {/* Add more details specific to Easy Care Gardening */}
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 mb-8 pt-20">
      <h1 className="text-2xl font-bold">Organizer not found</h1>
    </div>
  );
}
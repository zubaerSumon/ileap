'use client';

const VideoTestimonial = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">See the world. Immerse yourself. Make a difference</h2>
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <iframe
              src="https://www.youtube.com/embed/your-video-id"
              title="Volunteer Experience"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg w-full h-full"
            />
          </div>
          <div className="text-center">
            <blockquote className="text-lg italic text-gray-600 mb-4">
              Volunteering has made me who I am in Australia.
            </blockquote>
            <p className="text-sm text-gray-500">
              - Rachel M.
              <br />
              International Student Volunteering in Australia
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonial;
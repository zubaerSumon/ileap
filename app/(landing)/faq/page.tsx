"use client";

import FAQSection from "../../../components/layout/landing/faq/FAQSection";
import FAQHero from "../../../components/layout/landing/faq/FAQHero";
import RegistrationBanner from "../../../components/RegistrationBanner";
import Categories from "@/components/Categories";
import Image from "next/image";

const iLEAPFAQs = [
  {
    question: "What's AusLEAP?",
    answer:
      "AusLEAP is a platform that connects passionate volunteers with organizations making a difference in their communities. We facilitate meaningful volunteer opportunities and help organizations find dedicated individuals to support their causes.",
  },
  {
    question: "What is a community organisation?",
    answer:
      "Currently, we offer a wide range of volunteer opportunities across various sectors including education, healthcare, environmental conservation, and community development. Organizations can post opportunities, and volunteers can easily search and apply for positions that match their interests and skills.",
  },
  {
    question: "Why should I use AusLEAP?",
    answer:
      "By joining AusLEAP, you become part of a community dedicated to making positive change. Volunteers gain valuable experience, develop new skills, and make meaningful connections. Organizations benefit from dedicated support and can efficiently manage their volunteer programs through our platform.",
  },
];

const AusLEAPFAQs = [
  {
    question: "What's AusLEAP?",
    answer:
      "AusLEAP is our specialized program focused on volunteer opportunities across Australia. It connects Australian organizations with volunteers who want to make a difference in their local communities.",
  },
  {
    question: "If I'm not an international student, can I still get involved in this program?",
    answer:
      "While specific requirements vary by opportunity, most AusLEAP positions are open to individuals 18 years or older who are legally eligible to volunteer in Australia. Some roles may require specific skills, qualifications, or background checks.",
  },
  {
    question:
      "Will I be able to choose the type of volunteer opportunity that I would like to participate in?",
    answer:
      "Yes! Our matching system takes into account your preferences, skills, and interests to suggest relevant volunteer opportunities. You can also customize your search filters to find specific types of opportunities that align with your goals.",
  },
  {
    question: "When is the next AusLEAP workshop?",
    answer:
      "You can find all your AusLEAP-related messages in your dashboard's messaging center. If you're having trouble locating a specific message, please check your notification settings or contact our support team for assistance.",
  },
  {
    question: "How many workshops are there?",
    answer:
      "The number of activities you can participate in depends on your availability and the requirements of each opportunity. There's no strict limit, but we encourage volunteers to commit to opportunities they can fully dedicate themselves to.",
  },
  {
    question:
      "Will I receive certification for my participation in the program?",
    answer:
      "Yes, you will receive confirmation emails for all your volunteer applications and acceptances. Organizations may also provide certificates or documentation of your volunteer service upon completion of programs.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <FAQHero />
      <div className="w-full pt-20 pb-16">
        <Image
          src="/banner1.svg"
          width={1440}
          height={250}
          alt="Picture of the author"
          className="w-full"
          priority
        />
      </div>
      <div className="container mx-auto px-4 py-16 -mt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">AusLEAP</h2>
          <p className="text-gray-500 text-center mb-4">
            Each week we get questions on volunteering topic. Browse all
            available discussions below -- We can&apos;t wait for you to join
            the conversation!
          </p>
          <FAQSection title="" faqs={iLEAPFAQs} />
        </div>
      </div>

      {/* Full width banner */}
      <div className="w-full py-16">
        <Image
          src="/banner2.svg"
          width={1440}
          height={250}
          alt="Picture of the author"
          className="w-full"
          priority
        />
      </div>

      <div className="container mx-auto p-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">AusLEAP</h2>
          <p className="text-gray-500 text-center mb-4">
            Each week we get questions on volunteering topic. Browse all
            available discussions below -- We can&apos;t wait for you to join the
            conversation
          </p>
          <FAQSection title="" faqs={AusLEAPFAQs} />
        </div>
      </div>
      <Categories />
      <RegistrationBanner
        title="AusLEAP 2025 registration has just opened!"
        description="We're here to help. If you have any questions about volunteering, donations, or our programs, please feel free to reach out. We look forward to hearing from you!"
        buttonText="Join us now"
      />
    </div>
  );
}

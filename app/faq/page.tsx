'use client';

import FAQSection from '../../components/faq/FAQSection';
import FAQHero from '../../components/faq/FAQHero';
import FAQRegistrationBanner from '../../components/RegistrationBanner';
import Categories from '@/components/Categories';

const iLEAPFAQs = [
  {
    question: "What's iLEAP?",
    answer: "iLEAP is a platform that connects passionate volunteers with organizations making a difference in their communities. We facilitate meaningful volunteer opportunities and help organizations find dedicated individuals to support their causes."
  },
  {
    question: "What is currently available?",
    answer: "Currently, we offer a wide range of volunteer opportunities across various sectors including education, healthcare, environmental conservation, and community development. Organizations can post opportunities, and volunteers can easily search and apply for positions that match their interests and skills."
  },
  {
    question: "Why should you join iLEAP?",
    answer: "By joining iLEAP, you become part of a community dedicated to making positive change. Volunteers gain valuable experience, develop new skills, and make meaningful connections. Organizations benefit from dedicated support and can efficiently manage their volunteer programs through our platform."
  }
];

const AusLEAPFAQs = [
  {
    question: "What's AusLEAP?",
    answer: "AusLEAP is our specialized program focused on volunteer opportunities across Australia. It connects Australian organizations with volunteers who want to make a difference in their local communities."
  },
  {
    question: "Are there any prerequisites about AusLEAP?",
    answer: "While specific requirements vary by opportunity, most AusLEAP positions are open to individuals 18 years or older who are legally eligible to volunteer in Australia. Some roles may require specific skills, qualifications, or background checks."
  },
  {
    question: "Will I Be Shown The Type Of Volunteer Opportunity That I Selected In My Preferences?",
    answer: "Yes! Our matching system takes into account your preferences, skills, and interests to suggest relevant volunteer opportunities. You can also customize your search filters to find specific types of opportunities that align with your goals."
  },
  {
    question: "Where's My AusLEAP Message?",
    answer: "You can find all your AusLEAP-related messages in your dashboard's messaging center. If you're having trouble locating a specific message, please check your notification settings or contact our support team for assistance."
  },
  {
    question: "How many activities per Day?",
    answer: "The number of activities you can participate in depends on your availability and the requirements of each opportunity. There's no strict limit, but we encourage volunteers to commit to opportunities they can fully dedicate themselves to."
  },
  {
    question: "Will I Receive Confirmation For My Participation In Any Program?",
    answer: "Yes, you will receive confirmation emails for all your volunteer applications and acceptances. Organizations may also provide certificates or documentation of your volunteer service upon completion of programs."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <FAQHero />
      <div className="container mx-auto px-4 py-16 -mt-8">
        <div className="max-w-4xl mx-auto">
          <FAQSection title="iLEAP" faqs={iLEAPFAQs} />
          <FAQSection title="AusLEAP" faqs={AusLEAPFAQs} />
        </div>
      </div>
      <Categories />
      <FAQRegistrationBanner />
    </div>
  );
}
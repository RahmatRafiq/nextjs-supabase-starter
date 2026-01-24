-- Migration: Update site_settings with generic content
-- This removes all HMJF/Kemafar/pharmacy-specific references from database

-- Update 'home' settings with generic content
UPDATE site_settings
SET
  content = '{
    "hero": {
      "badge": "Student Organization",
      "title": "Your Organization",
      "titleHighlight": "Community",
      "subtitle": "Building Together",
      "description": "A platform for aspiration, creativity, and self-development for our community members",
      "primaryCTA": {
        "text": "Learn More",
        "link": "/about"
      },
      "secondaryCTA": {
        "text": "Our Programs",
        "link": "#features"
      },
      "backgroundImage": "/images/hero-bg.jpg",
      "stats": [
        { "value": "150+", "label": "Active Members" },
        { "value": "20+", "label": "Events / Year" },
        { "value": "8", "label": "Divisions" }
      ]
    },
    "features": {
      "title": "Our Programs",
      "description": "Various development programs for professional and high-integrity community members",
      "items": [
        {
          "title": "Academic Development",
          "description": "Programs to enhance academic competence and research skills",
          "icon": "GraduationCap"
        },
        {
          "title": "Professional Training",
          "description": "Training and certification for career preparation",
          "icon": "Leaf"
        },
        {
          "title": "Leadership",
          "description": "Character building and leadership development",
          "icon": "Users"
        },
        {
          "title": "Community Service",
          "description": "Real contributions to society and the environment",
          "icon": "Heart"
        }
      ]
    },
    "cta": {
      "title": "Join Us Today",
      "description": "Be part of our growing community and make an impact",
      "primaryCTA": {
        "text": "Contact Us",
        "link": "/contact"
      },
      "secondaryCTA": {
        "text": "WhatsApp",
        "phone": "628123456789"
      }
    }
  }'::jsonb,
  updated_at = NOW()
WHERE key = 'home';

-- Update 'about' settings with generic content
UPDATE site_settings
SET
  content = '{
    "story": "Your Organization is a modern platform designed to bring communities together. We provide tools for content management, event organization, and member engagement. Founded with the vision of empowering communities through technology, we continue to innovate and serve our members with excellence.",
    "mission": [
      "Empower communities through modern technology and collaboration",
      "Foster growth and development of our members",
      "Build strong networks and partnerships",
      "Deliver meaningful value to the community"
    ],
    "vision": "To be a leading platform for community engagement and digital collaboration",
    "values": [
      {
        "title": "Integrity",
        "description": "Upholding honesty and professional ethics in everything we do",
        "icon": "BookOpen"
      },
      {
        "title": "Collaboration",
        "description": "Working together to achieve shared goals",
        "icon": "Users"
      },
      {
        "title": "Innovation",
        "description": "Continuously innovating in all our programs and activities",
        "icon": "HeartHandshake"
      },
      {
        "title": "Dedication",
        "description": "Fully committed to organizational growth and excellence",
        "icon": "Briefcase"
      }
    ],
    "statistics": {
      "activeMembers": "150+",
      "eventsPerYear": "20+",
      "divisions": "8",
      "yearsActive": "2015"
    },
    "timeline": [
      {
        "year": "2020",
        "title": "Organization Founded",
        "description": "Officially established to serve our community"
      },
      {
        "year": "2021",
        "title": "Program Expansion",
        "description": "Launched structured programs and initiatives"
      },
      {
        "year": "2022",
        "title": "Digital Transformation",
        "description": "Embraced digital tools for better community engagement"
      },
      {
        "year": "2024",
        "title": "Continuous Innovation",
        "description": "Developing innovative programs and cross-institutional collaboration"
      }
    ],
    "affiliations": [
      {
        "name": "Industry Association",
        "type": "National",
        "description": "National-level industry organization"
      },
      {
        "name": "Professional Network",
        "type": "Professional",
        "description": "Professional networking organization"
      },
      {
        "name": "Partner Institution",
        "type": "Institution",
        "description": "Partner educational or business institution"
      }
    ],
    "certifications": [
      {
        "name": "Quality Certification",
        "year": "2023"
      },
      {
        "name": "ISO 9001:2015",
        "year": "2022"
      }
    ]
  }'::jsonb,
  updated_at = NOW()
WHERE key = 'about';

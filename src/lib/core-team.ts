// Technika K27 – Core Members
// Source: "Technika K27 Core Members (Responses)" Google Sheet

export interface CoreMember {
  image: string;
  title: string;
  subtitle: "HEAD" | "CO-HEAD" | "GENERAL SECRETARY";
  handle: string;
  borderColor: string;
  gradient: string;
  url: string;
}

export interface CoreSection {
  id: string;
  title: string;
  description: string;
  members: CoreMember[];
}

// GENERAL SECRETARY
export const generalSecretaryTeam: CoreMember[] = [
  {
    image: "",
    title: "",
    subtitle: "GENERAL SECRETARY",
    handle: "",
    borderColor: "#FFD700",
    gradient: "linear-gradient(145deg, #FFD700, #FF6B6B)",
    url: "",
  },
];

// WEB DESIGN AND MANAGEMENT TEAM
export const webDesignTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/xcQkK7J/Aayush-Arya.jpg",
    title: "Aayush Arya",
    subtitle: "HEAD",
    handle: "Portfolio",
    borderColor: "#FF6B6B",
    gradient: "linear-gradient(145deg, #FF6B6B, #4ECDC4)",
    url: "http://work.aayusharya.tech/",
  },
  {
    image: "https://i.ibb.co/jk3jqXLs/Krish-Agarwal.jpg",
    title: "Krish Agarwal",
    subtitle: "HEAD",
    handle: "@coffee.to.code.machine",
    borderColor: "#1ABC9C",
    gradient: "linear-gradient(145deg, #1ABC9C, #2C3E50)",
    url: "https://www.instagram.com/coffee.to.code.machine/",
  },
  {
    image: "https://i.ibb.co/Xr5zBnN5/Virat-Mishra.png",
    title: "Virat",
    subtitle: "CO-HEAD",
    handle: "@vir_x_t",
    borderColor: "#1ABC9C",
    gradient: "linear-gradient(145deg, #1ABC9C, #2C3E50)",
    url: "https://www.instagram.com/vir_x_t/",
  },
  {
    image: "https://i.ibb.co/p6bd49cK/Krishna-Kant-Jha.png",
    title: "Krishankant Jha",
    subtitle: "CO-HEAD",
    handle: "LinkedIn",
    borderColor: "#45B7D1",
    gradient: "linear-gradient(145deg, #45B7D1, #96E6A1)",
    url: "https://www.linkedin.com/in/krishankant-jha-kk00001",
  },
  {
    image: "https://i.ibb.co/yvpDwZq/Aditya-Shrivastava.jpg",
    title: "Aditya Shrivastava",
    subtitle: "CO-HEAD",
    handle: "@aditya_shrivastava_21_",
    borderColor: "#F39C12",
    gradient: "linear-gradient(145deg, #F39C12, #8E44AD)",
    url: "https://www.instagram.com/aditya_shrivastava_21_/",
  },
];

// TREASURY TEAM
export const treasuryTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/YFH3W6Lg/Pratyush-Kamal.jpg",
    title: "Pratyush Kamal",
    subtitle: "HEAD",
    handle: "@pratyush__bhardwajj",
    borderColor: "#96E6A1",
    gradient: "linear-gradient(145deg, #96E6A1, #F39C12)",
    url: "https://www.instagram.com/pratyush__bhardwajj/",
  },
  {
    image: "https://i.ibb.co/yFg57sYV/Nipun-Sinha.jpg",
    title: "Nipun Sinha",
    subtitle: "HEAD",
    handle: "@uffx_nipun",
    borderColor: "#8E44AD",
    gradient: "linear-gradient(145deg, #8E44AD, #1ABC9C)",
    url: "https://www.instagram.com/uffx_nipun/",
  },
  {
    image: "https://i.ibb.co/Mw2g7CH/Daksha-Chandra.jpg",
    title: "Daksha Chandra",
    subtitle: "CO-HEAD",
    handle: "@daksha_cr",
    borderColor: "#2C3E50",
    gradient: "linear-gradient(145deg, #2C3E50, #9B59B6)",
    url: "https://www.instagram.com/daksha_cr/",
  },
];

// DESIGN & DECOR TEAM
export const designDecorTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/mFPTJhS3/Shreyanka-Basak.jpg",
    title: "Shreyanka Basak",
    subtitle: "HEAD",
    handle: "@shreyaaaanka__",
    borderColor: "#1ABC9C",
    gradient: "linear-gradient(145deg, #1ABC9C, #2C3E50)",
    url: "https://www.instagram.com/shreyaaaanka__/",
  },
  {
    image: "https://i.ibb.co/tMTZNyWY/Priyanshu-Vats.jpg",
    title: "Priyanshu Vats",
    subtitle: "CO-HEAD",
    handle: "@areyyrpriyanshu",
    borderColor: "#9B59B6",
    gradient: "linear-gradient(145deg, #9B59B6, #3498DB)",
    url: "https://www.instagram.com/areyyrpriyanshu?dmpr=OWp0cGE2MzA4Y21q&utm_source=qr",
  },
  {
    image: "https://i.ibb.co/MDDmWQ1g/Samiksha-Kumari.png",
    title: "Samiksha Kumari",
    subtitle: "CO-HEAD",
    handle: "@sam_061128",
    borderColor: "#E74C3C",
    gradient: "linear-gradient(145deg, #E74C3C, #F1C40F)",
    url: "https://www.instagram.com/sam_061128/",
  },
];

// DESIGN & DRAFTING TEAM
export const designDraftingTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/pv2DQMsp/Prisha-Raj.jpg",
    title: "Prisha Raj",
    subtitle: "HEAD",
    handle: "@pri.sha_1505",
    borderColor: "#3498DB",
    gradient: "linear-gradient(145deg, #3498DB, #E74C3C)",
    url: "https://www.instagram.com/pri.sha_1505/",
  },
  {
    image: "https://i.ibb.co/rfqCBj1V/Shreya-Kumari.webp",
    title: "Shreya Kumari",
    subtitle: "CO-HEAD",
    handle: "@agrwlshreya_08",
    borderColor: "#F1C40F",
    gradient: "linear-gradient(145deg, #F1C40F, #2ECC71)",
    url: "https://www.instagram.com/agrwlshreya_08/",
  },
  {
    image: "https://i.ibb.co/vxVYZWRP/Anandini-Singh.jpg",
    title: "Anandini Singh",
    subtitle: "CO-HEAD",
    handle: "@anandinisingh",
    borderColor: "#2196F3",
    gradient: "linear-gradient(145deg, #2196F3, #FF9800)",
    url: "https://www.instagram.com/anandinisingh/",
  },
  {
    image: "https://i.ibb.co/4RP1JjXc/Utkarsh-Priyadarshi.png",
    title: "Utkarsh Priyadarshi",
    subtitle: "CO-HEAD",
    handle: "@utkarshhz.exe",
    borderColor: "#4CAF50",
    gradient: "linear-gradient(145deg, #4CAF50, #795548)",
    url: "https://www.instagram.com/utkarshhz.exe/",
  },
  {
    image: "https://i.ibb.co/C3RrNYFg/Deep-Anchal.png",
    title: "Deep Anchal",
    subtitle: "CO-HEAD",
    handle: "@anchalxd33p",
    borderColor: "#E67E22",
    gradient: "linear-gradient(145deg, #E67E22, #E91E63)",
    url: "https://www.instagram.com/anchalxd33p/",
  },
];

// EVENT MANAGEMENT TEAM
export const eventManagementTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/h1nSJL3C/Suryansh-Garg.jpg",
    title: "Suryansh Garg",
    subtitle: "CO-HEAD",
    handle: "@a_sabhya_aadmi",
    borderColor: "#2ECC71",
    gradient: "linear-gradient(145deg, #2ECC71, #E67E22)",
    url: "https://www.instagram.com/a_sabhya_aadmi/",
  },
  {
    image: "https://i.ibb.co/JwRPjvBQ/Harsh-Singh-Rajput.png",
    title: "Harsh Raj",
    subtitle: "CO-HEAD",
    handle: "@harshxsinghx",
    borderColor: "#E91E63",
    gradient: "linear-gradient(145deg, #E91E63, #2196F3)",
    url: "https://www.instagram.com/harshxsinghx/",
  },
  {
    image: "https://i.ibb.co/wF5fY2hB/Pranjal-Sharma.jpg",
    title: "Pranjal Sharma",
    subtitle: "CO-HEAD",
    handle: "@prranjal_17",
    borderColor: "#FF9800",
    gradient: "linear-gradient(145deg, #FF9800, #4CAF50)",
    url: "https://www.instagram.com/prranjal_17/",
  },
];

// VENUE MANAGEMENT TEAM
export const venueManagementTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/KjfYtK32/Divyansh-Saverneya.jpg",
    title: "Divyansh Saverneya",
    subtitle: "CO-HEAD",
    handle: "@saverneya21",
    borderColor: "#2196F3",
    gradient: "linear-gradient(145deg, #2196F3, #FF9800)",
    url: "https://www.instagram.com/saverneya21/",
  },
  {
    image: "https://i.ibb.co/QvXq1HvV/Nishant-Gourav-Ray.jpg",
    title: "Nishant Gourav Ray",
    subtitle: "CO-HEAD",
    handle: "@nishant_qverse",
    borderColor: "#4CAF50",
    gradient: "linear-gradient(145deg, #4CAF50, #795548)",
    url: "https://www.instagram.com/nishant_qverse/",
  },
  {
    image:
      "https://i.ibb.co/8Dh4XnxN/Whats-App-Image-2026-11-27-at-2-51-20-PM-1.jpg",
    title: "Sanidhya Singh",
    subtitle: "CO-HEAD",
    handle: "LinkedIn",
    borderColor: "#607D8B",
    gradient: "linear-gradient(145deg, #607D8B, #3F51B5)",
    url: "https://www.linkedin.com/in/sanidhya-singh-5929b5373",
  },
  {
    image: "https://i.ibb.co/prZvDhL5/Shashish-Kumar.jpg",
    title: "Shashish Kumar",
    subtitle: "CO-HEAD",
    handle: "@Shashish__7",
    borderColor: "#00BCD4",
    gradient: "linear-gradient(145deg, #00BCD4, #FF5722)",
    url: "https://www.instagram.com/Shashish__7/",
  },
];

// PUBLICITY TEAM
export const publicityTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/hJcTskK8/Soumya-Sharma.jpg",
    title: "Soumya",
    subtitle: "HEAD",
    handle: "@altron.24",
    borderColor: "#795548",
    gradient: "linear-gradient(145deg, #795548, #607D8B)",
    url: "https://www.instagram.com/altron.24/",
  },
  {
    image: "https://i.ibb.co/v4GFy5RM/Ahsan-Ali.jpg",
    title: "Ahsan Ali",
    subtitle: "HEAD",
    handle: "@_.ahsan29",
    borderColor: "#3F51B5",
    gradient: "linear-gradient(145deg, #3F51B5, #00BCD4)",
    url: "https://www.instagram.com/_.ahsan29/",
  },
  {
    image: "https://i.ibb.co/Qv2LxgYP/Pratiksha-Singh.png",
    title: "Pratiksha Singh",
    subtitle: "CO-HEAD",
    handle: "@pratiksha__singhh_",
    borderColor: "#FF5722",
    gradient: "linear-gradient(145deg, #FF5722, #FFC107)",
    url: "https://www.instagram.com/pratiksha__singhh_/",
  },
  {
    image: "https://i.ibb.co/nF26f0F/Sapna-Yadav.png",
    title: "Sapna Yadav",
    subtitle: "CO-HEAD",
    handle: "@sapnayadav04_",
    borderColor: "#009688",
    gradient: "linear-gradient(145deg, #009688, #8BC34A)",
    url: "https://www.instagram.com/sapnayadav04_/",
  },
  {
    image: "https://i.ibb.co/1fpLk8rR/Rupalii-Sharmaa.jpg",
    title: "Rupali Sharma",
    subtitle: "CO-HEAD",
    handle: "@_rupali.sharmaa_",
    borderColor: "#673AB7",
    gradient: "linear-gradient(145deg, #673AB7, #FF4081)",
    url: "https://www.instagram.com/_rupali.sharmaa_/",
  },
  {
    image: "https://i.ibb.co/B5pXpSsH/Sakshi-Arya.jpg",
    title: "Sakshi",
    subtitle: "CO-HEAD",
    handle: "@sakshiyaar._",
    borderColor: "#F44336",
    gradient: "linear-gradient(145deg, #F44336, #FFEB3B)",
    url: "https://www.instagram.com/sakshiyaar._/",
  },
];

// PRESS & MEDIA TEAM
export const pressMediaTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/q3WdkSZ6/Snigddha.jpg",
    title: "Snigddha",
    subtitle: "CO-HEAD",
    handle: "@_snigddhahahaha_",
    borderColor: "#00BCD4",
    gradient: "linear-gradient(145deg, #00BCD4, #FF5722)",
    url: "https://www.instagram.com/_snigddhahahaha_/",
  },
  {
    image: "https://i.ibb.co/Q7b8Z6g8/Arya-Sumit.jpg",
    title: "Arya Sumit",
    subtitle: "CO-HEAD",
    handle: "@_aary_a_04",
    borderColor: "#FFC107",
    gradient: "linear-gradient(145deg, #FFC107, #009688)",
    url: "https://www.instagram.com/_aary_a_04/",
  },
];

// LOGISTICS TEAM
export const logisticsTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/39wLQfJg/Priyanshu-Kumar.png",
    title: "Priyanshu",
    subtitle: "CO-HEAD",
    handle: "@areyyrpriyanshu",
    borderColor: "#009688",
    gradient: "linear-gradient(145deg, #009688, #8BC34A)",
    url: "https://www.instagram.com/areyyrpriyanshu/",
  },
  {
    image: "https://i.ibb.co/JWngwd7m/Amartya-Prakash.png",
    title: "Amartya",
    subtitle: "CO-HEAD",
    handle: "@amartyyaaa",
    borderColor: "#673AB7",
    gradient: "linear-gradient(145deg, #673AB7, #FF4081)",
    url: "https://www.instagram.com/amartyyaaa/",
  },
  {
    image: "https://i.ibb.co/Fkrt8CtX/Abhishu-Kumar.jpg",
    title: "Abhishu Kumar",
    subtitle: "CO-HEAD",
    handle: "@abhishu_singh_",
    borderColor: "#F44336",
    gradient: "linear-gradient(145deg, #F44336, #FFEB3B)",
    url: "https://www.instagram.com/abhishu_singh_/",
  },
];

// FOOD & CATERING TEAM
export const foodCateringTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/SDrFcLR5/Shaurya-Veer.jpg",
    title: "Shaurya Veer",
    subtitle: "HEAD",
    handle: "@shauryyyaaa____",
    borderColor: "#FF4081",
    gradient: "linear-gradient(145deg, #FF4081, #F44336)",
    url: "https://www.instagram.com/shauryyyaaa____/",
  },
  {
    image: "https://i.ibb.co/JWVRZTrb/Harsh-Raj-Pratap-Singh.jpg",
    title: "Harshit Raj Pratap Singh",
    subtitle: "CO-HEAD",
    handle: "@harsheeett",
    borderColor: "#FFEB3B",
    gradient: "linear-gradient(145deg, #FFEB3B, #FF6B6B)",
    url: "https://www.instagram.com/harsheeett/",
  },
  {
    image: "https://i.ibb.co/RpKSpg4n/Rahul-Kumar.jpg",
    title: "Rahul Kumar",
    subtitle: "CO-HEAD",
    handle: "@ig.x.rahul",
    borderColor: "#4ECDC4",
    gradient: "linear-gradient(145deg, #4ECDC4, #45B7D1)",
    url: "https://www.instagram.com/ig.x.rahul/",
  },
];

// CULTURAL MANAGEMENT TEAM
export const culturalManagementTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/Y7FT0t1g/Sarthak-Routh.jpg",
    title: "Sarthak Routh",
    subtitle: "CO-HEAD",
    handle: "@sro_uth",
    borderColor: "#FF6B6B",
    gradient: "linear-gradient(145deg, #FF6B6B, #4ECDC4)",
    url: "https://www.instagram.com/sro_uth/",
  },
  {
    image: "https://i.ibb.co/v4W6nPft/Pratik-Kumar.jpg",
    title: "Pratik Kumar",
    subtitle: "CO-HEAD",
    handle: "LinkedIn",
    borderColor: "#45B7D1",
    gradient: "linear-gradient(145deg, #45B7D1, #96E6A1)",
    url: "https://www.linkedin.com/in/pratik-kumar-203372381",
  },
  {
    image: "https://i.ibb.co/DHz8PB4d/Sidhpreet-Singh.png",
    title: "Sidhpreet Singh",
    subtitle: "CO-HEAD",
    handle: "@sidh_32",
    borderColor: "#F39C12",
    gradient: "linear-gradient(145deg, #F39C12, #8E44AD)",
    url: "https://www.instagram.com/sidh_32/",
  },
];

// SPONSORSHIP TEAM
export const sponsorshipTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/fz6WjvT9/Anwesha-Ranjan.jpg",
    title: "Anwesha Ranjan",
    subtitle: "CO-HEAD",
    handle: "@_simplyanwesha",
    borderColor: "#96E6A1",
    gradient: "linear-gradient(145deg, #96E6A1, #F39C12)",
    url: "https://www.instagram.com/_simplyanwesha/",
  },
  {
    image: "https://i.ibb.co/W48xS2Fn/Siddique-Anwar.jpg",
    title: "Md Siddique Anwar",
    subtitle: "CO-HEAD",
    handle: "@moh4mmad.26",
    borderColor: "#8E44AD",
    gradient: "linear-gradient(145deg, #8E44AD, #1ABC9C)",
    url: "https://www.instagram.com/moh4mmad.26/",
  },
  {
    image: "https://i.ibb.co/ZR8XFQd3/Aman-Arya.jpg",
    title: "Aman Arya",
    subtitle: "CO-HEAD",
    handle: "@_arya_aman_",
    borderColor: "#2C3E50",
    gradient: "linear-gradient(145deg, #2C3E50, #9B59B6)",
    url: "https://www.instagram.com/_arya_aman_/",
  },
];

// SOCIAL MEDIA TEAM
export const socialMediaTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/Lhsh5Vvp/Anshu-Priya.jpg",
    title: "Anshu Priya",
    subtitle: "HEAD",
    handle: "@_.official.honey",
    borderColor: "#1ABC9C",
    gradient: "linear-gradient(145deg, #1ABC9C, #2C3E50)",
    url: "https://www.instagram.com/_.official.honey/",
  },
  {
    image: "https://i.ibb.co/G4HTPRHQ/Ayush-Ranjan.jpg",
    title: "Ayush Ranjan",
    subtitle: "CO-HEAD",
    handle: "@ayyush_17",
    borderColor: "#9B59B6",
    gradient: "linear-gradient(145deg, #9B59B6, #3498DB)",
    url: "https://www.instagram.com/ayyush_17/",
  },
  {
    image: "https://i.ibb.co/Q319Dp1B/Jigaysa.jpg",
    title: "Jigyasa",
    subtitle: "CO-HEAD",
    handle: "@jigsawwpuzzle",
    borderColor: "#E74C3C",
    gradient: "linear-gradient(145deg, #E74C3C, #F1C40F)",
    url: "https://www.instagram.com/jigsawwpuzzle/",
  },
];

// HOSPITALITY TEAM
export const hospitalityTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/RpWdyb9X/Shubhankar-Jha.jpg",
    title: "Shubhankar Kumar Jha",
    subtitle: "HEAD",
    handle: "@shubhankar_jha_18",
    borderColor: "#3498DB",
    gradient: "linear-gradient(145deg, #3498DB, #E74C3C)",
    url: "https://www.instagram.com/shubhankar_jha_18/",
  },
  {
    image: "https://i.ibb.co/3YvvGycB/Ashish-Pandit.jpg",
    title: "Ashish Pandit",
    subtitle: "CO-HEAD",
    handle: "@panditashish264",
    borderColor: "#F1C40F",
    gradient: "linear-gradient(145deg, #F1C40F, #2ECC71)",
    url: "https://www.instagram.com/panditashish264/",
  },
];

// DISCIPLINE TEAM
export const disciplineTeam: CoreMember[] = [
  {
    image: "https://i.ibb.co/PZccGGVj/Aman-Singh.png",
    title: "Aman Kumar",
    subtitle: "HEAD",
    handle: "@amanx_.exe",
    borderColor: "#2ECC71",
    gradient: "linear-gradient(145deg, #2ECC71, #E67E22)",
    url: "https://www.instagram.com/amanx_.exe/",
  },
  {
    image: "https://i.ibb.co/cSTdZFfF/Danish-Iqbal.jpg",
    title: "Danish Iqbal",
    subtitle: "HEAD",
    handle: "@i.danishiqbal",
    borderColor: "#E91E63",
    gradient: "linear-gradient(145deg, #E91E63, #2196F3)",
    url: "https://www.instagram.com/i.danishiqbal/",
  },
  {
    image: "https://i.ibb.co/6VnrQyt/Aniket-Kashyap.jpg",
    title: "Aniket Kashyap",
    subtitle: "CO-HEAD",
    handle: "@kashyap_aniket_27",
    borderColor: "#FF9800",
    gradient: "linear-gradient(145deg, #FF9800, #4CAF50)",
    url: "https://www.instagram.com/kashyap_aniket_27/",
  },
  {
    image: "https://i.ibb.co/6Sf3bhT/Shivam-Kumar.webp",
    title: "Shivam Kumar",
    subtitle: "CO-HEAD",
    handle: "@th_shi_",
    borderColor: "#795548",
    gradient: "linear-gradient(145deg, #795548, #607D8B)",
    url: "https://www.instagram.com/th_shi_/",
  },
  {
    image: "https://i.ibb.co/8nLQWHRy/Aman-Bhardwaj.jpg",
    title: "Aman Bhardwaj",
    subtitle: "CO-HEAD",
    handle: "@aman.bharddwaj",
    borderColor: "#3F51B5",
    gradient: "linear-gradient(145deg, #3F51B5, #00BCD4)",
    url: "https://www.instagram.com/aman.bharddwaj/",
  },
  {
    image: "https://i.ibb.co/wrwGfzf8/Apurv-Mishra.jpg",
    title: "Apurv Mishr",
    subtitle: "CO-HEAD",
    handle: "@apurv.prem",
    borderColor: "#FF5722",
    gradient: "linear-gradient(145deg, #FF5722, #FFC107)",
    url: "https://www.instagram.com/apurv.prem/",
  },
];

export const coreSections: CoreSection[] = [
  {
    id: "gs",
    title: "General Secretary",
    description: "Leading and coordinating the entire team",
    members: generalSecretaryTeam,
  },
  {
    id: "web",
    title: "Web Design & Management Team",
    description: "Developing and maintaining web presence",
    members: webDesignTeam,
  },
  {
    id: "treasury",
    title: "Treasury Team",
    description: "Managing finances and resources",
    members: treasuryTeam,
  },
  {
    id: "decor",
    title: "Design & Decor Team",
    description: "Creating beautiful visual experiences",
    members: designDecorTeam,
  },
  {
    id: "drafting",
    title: "Design & Drafting Team",
    description: "Planning and technical design",
    members: designDraftingTeam,
  },
  {
    id: "event",
    title: "Event Management Team",
    description: "Coordinating and executing events",
    members: eventManagementTeam,
  },
  {
    id: "venue",
    title: "Venue Management Team",
    description: "Managing event venues and spaces",
    members: venueManagementTeam,
  },
  {
    id: "publicity",
    title: "Publicity Team",
    description: "Promoting events and activities",
    members: publicityTeam,
  },
  {
    id: "press",
    title: "Press & Media Team",
    description: "Handling media relations and coverage",
    members: pressMediaTeam,
  },
  {
    id: "logistics",
    title: "Logistics Team",
    description: "Managing operations and supplies",
    members: logisticsTeam,
  },
  {
    id: "food",
    title: "Food & Catering Team",
    description: "Handling food services and hospitality",
    members: foodCateringTeam,
  },
  {
    id: "cultural",
    title: "Cultural Management Team",
    description: "Organizing cultural events and activities",
    members: culturalManagementTeam,
  },
  {
    id: "sponsorship",
    title: "Sponsorship Team",
    description: "Securing partnerships and funding",
    members: sponsorshipTeam,
  },
  {
    id: "social",
    title: "Social Media Team",
    description: "Managing online presence and engagement",
    members: socialMediaTeam,
  },
  {
    id: "hospitality",
    title: "Hospitality Team",
    description: "Welcoming and assisting guests",
    members: hospitalityTeam,
  },
  {
    id: "discipline",
    title: "Discipline Team",
    description: "Maintaining order and discipline during events",
    members: disciplineTeam,
  },
];

export default coreSections;

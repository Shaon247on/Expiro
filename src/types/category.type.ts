export interface Category {
  id: string;
  name: string;
  image: string | null;        // URL or null
  projectCount: number;
  createdAt: string;           // ISO string
}

export const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Design Systems",    image: null, projectCount: 12, createdAt: "2025-01-15T10:00:00Z" },
  { id: "2", name: "Frontend",          image: null, projectCount: 8,  createdAt: "2025-02-03T09:30:00Z" },
  { id: "3", name: "Backend Services",  image: null, projectCount: 15, createdAt: "2025-02-18T14:00:00Z" },
  { id: "4", name: "Mobile Apps",       image: null, projectCount: 5,  createdAt: "2025-03-01T11:00:00Z" },
  { id: "5", name: "DevOps",            image: null, projectCount: 3,  createdAt: "2025-03-10T08:00:00Z" },
  { id: "6", name: "Data & Analytics",  image: null, projectCount: 7,  createdAt: "2025-03-22T16:00:00Z" },
  { id: "7", name: "Security",          image: null, projectCount: 4,  createdAt: "2025-04-05T12:00:00Z" },
  { id: "8", name: "QA & Testing",      image: null, projectCount: 6,  createdAt: "2025-04-14T10:30:00Z" },
  { id: "9", name: "Infrastructure",    image: null, projectCount: 9,  createdAt: "2025-05-01T09:00:00Z" },
  { id: "10", name: "AI / ML",          image: null, projectCount: 11, createdAt: "2025-05-20T14:00:00Z" },
  { id: "11", name: "Product",          image: null, projectCount: 2,  createdAt: "2025-06-01T10:00:00Z" },
  { id: "12", name: "Marketing Tech",   image: null, projectCount: 4,  createdAt: "2025-06-15T08:30:00Z" },
];

export const CATEGORY_PAGE_SIZE = 8;
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  isChild?: boolean;
}

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'u1', name: 'Sarah Jenkins', relation: 'Self', avatar: 'https://picsum.photos/seed/u1/200' },
  { id: 'f1', name: 'Leo Jenkins', relation: 'Son', avatar: 'https://picsum.photos/seed/leo/200', isChild: true },
  { id: 'f2', name: 'Mia Jenkins', relation: 'Daughter', avatar: 'https://picsum.photos/seed/mia/200', isChild: true },
  { id: 'f3', name: 'Mark Jenkins', relation: 'Husband', avatar: 'https://picsum.photos/seed/mark/200' },
];

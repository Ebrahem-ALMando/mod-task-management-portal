export type IconType =
  | 'shield'
  | 'user'
  | 'document'
  | 'building'
  | 'briefcase'
  | 'medal'
  | 'calendar'
  | 'clipboard'
  | 'envelope'
  | 'phone'
  | 'bell'
  | 'settings';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: IconType;
  description?: string;
}

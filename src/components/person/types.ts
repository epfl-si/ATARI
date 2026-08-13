export type PersonTranslations = {
  fields: (key: string) => string;
  sections: (key: string) => string;
  toolLabels: (key: string) => string;
  accred: (key: string) => string;
  ad: (key: string, values?: Record<string, string>) => string;
  common: (key: string) => string;
};

export type GeneratedFileStatus = "created" | "skipped";

export type GeneratedFile = {
  path: string;
  status: GeneratedFileStatus;
};

export type InitResult = {
  root: string;
  files: GeneratedFile[];
};

export interface AttrResponse {
  id: number;
  name: string;
  displayOrder: number;
  attrs: Attr[];
}

export interface Attr {
  id: number;
  name: string;
  attrGroupId: number;
  unit: number;
  description: string;
  displayOrder: number;
  value: string;
  formatField: FormatField;
}

export interface FormatField {
  type: string;
  max: number;
  min: number;
  length: number;
  selects: Select[];
  defaultValue?: string;
  unit?: string;
}

export interface Select {
  id: number;
  name: string;
}

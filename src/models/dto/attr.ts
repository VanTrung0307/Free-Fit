export interface StoreAttrs {
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
  displayOrder: number;
  value: string;
  formatField: FormatField;
}

export interface FormatField {
  type: string;
  max: number;
  min: number;
  length: number;
  selects: any[];
}
export interface PostAttr {
  attrId: number;
  value: string;
}

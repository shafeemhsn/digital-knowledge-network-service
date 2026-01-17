export interface CreateRegionInput {
  id: string;
  name: string;
}

export interface CreateOfficeInput {
  name: string;
  regionId: string;
}

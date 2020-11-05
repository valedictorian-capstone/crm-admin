export interface Province {
  id: number;
  name: string;
  huyen: District[];
}

export interface District {
  id: number;
  name: string;
  tinh_id: number;
}

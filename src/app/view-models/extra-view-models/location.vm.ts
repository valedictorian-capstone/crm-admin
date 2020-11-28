export interface Province {
  readonly id: number;
  readonly name: string;
  readonly huyen: District[];
}

export interface District {
  readonly id: number;
  readonly name: string;
  readonly tinh_id: number;
}

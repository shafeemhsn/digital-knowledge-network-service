import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Region {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;
}

export type IRegion = Region;

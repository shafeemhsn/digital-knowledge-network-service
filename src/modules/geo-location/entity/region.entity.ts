import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Region {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;
}

export type IRegion = Region;

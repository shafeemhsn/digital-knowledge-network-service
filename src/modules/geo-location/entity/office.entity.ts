import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Region } from "./region.entity";

@Entity()
export class Office {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Region, { onDelete: "CASCADE" })
  @JoinColumn({ name: "region_id" })
  region!: Region;
}

export type IOffice = Office;

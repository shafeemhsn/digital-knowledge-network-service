import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcrypt";
import { Role } from "./role.enity";
import { Region } from "../../geo-location/entity/region.entity";

const saltRounds = 10;

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "text", nullable: true })
  expertise?: string | null;

  @Column({ type: "integer", nullable: true, name: "contribution_score" })
  contributionScore?: number | null;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: "role_id" })
  role?: Role | null;

  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: "region_id" })
  region?: Region | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password || this.password.startsWith("$2")) {
      return;
    }

    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}

export type IUser = User;

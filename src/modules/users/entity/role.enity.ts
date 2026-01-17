import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { User } from "./user.enity";
import { Permission } from "./permission.enity";
import { RoleName } from "../role-permission.enums";

@Entity({ name: "roles" })
export class Role {
  @PrimaryColumn({ type: "text" })
  id!: string;

  @Column({ type: "text", enum: RoleName, unique: true })
  name!: RoleName;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: "roles_permissions" })
  permissions?: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users?: User[];
}

export type IRole = Role;

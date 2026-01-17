import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.enity";
import { PermissionName } from "../role-permission.enums";

@Entity({ name: "permissions" })
export class Permission {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", enum: PermissionName, unique: true })
  name!: PermissionName;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[];
}

export type IPermission = Permission;

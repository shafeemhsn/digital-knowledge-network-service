import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { IValidationRecord } from "../interface/validation-record.interface";
import { ValidationDecision } from "../interface/compliance.enums";
import { KnowledgeResource } from "../../knowledge-manager/enity/knowledge-resource.enity";
import { User } from "../../users/entity/user.enity";

@Entity({ name: "validation_records" })
export class ValidationRecord implements IValidationRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => KnowledgeResource, { onDelete: "CASCADE" })
  @JoinColumn({ name: "knowledge_resource_id" })
  knowledgeResourceId!: KnowledgeResource;

  @Column({
    type: "text",
    enum: ValidationDecision,
  })
  decision!: ValidationDecision;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "validated_by" })
  validatedBy!: User;

  @Column({ type: "timestamptz", name: "validated_at" })
  validatedAt!: Date;
}

export type IValidationRecordEntity = ValidationRecord;

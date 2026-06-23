import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileType } from './enums/file-type.enum';

@Entity('Upload')
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  path: string;

  @Column({
    type: 'enum',
    enum: FileType,
    default: FileType.IMAGE,
    nullable: false,
  })
  type: FileType;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  mime: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  size: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}

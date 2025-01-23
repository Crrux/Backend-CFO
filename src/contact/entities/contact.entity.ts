import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstname: string;

  @Column()
  email: string;

  @Column()
  tel: string;

  @Column()
  message: string;

  @Column()
  reference: string;

  @CreateDateColumn()
  created_at: Date;
}

drop table teacher_subject CASCADE;
create table teacher_subject (
	teacher_id int not null,
	subject_id int not null,
	foreign key (teacher_id) references teacher(id) on delete CASCADE,
	foreign key (subject_id) references subject(id) on delete CASCADE
);
create UNIQUE INDEX index_name on teacher_subject(teacher_id,subject_id)
insert into teacher_subject (teacher_id, subject_id) values (1, 1);
insert into teacher_subject (teacher_id, subject_id) values (1, 2);
insert into teacher_subject (teacher_id, subject_id) values (1, 3);

insert into teacher_subject (teacher_id, subject_id) values (2, 2);
insert into teacher_subject (teacher_id, subject_id) values (2, 3);
insert into teacher_subject (teacher_id, subject_id) values (2, 4);

insert into teacher_subject (teacher_id, subject_id) values (3, 3);
insert into teacher_subject (teacher_id, subject_id) values (3, 4);
insert into teacher_subject (teacher_id, subject_id) values (3, 5);

insert into teacher_subject (teacher_id, subject_id) values (4, 5);
insert into teacher_subject (teacher_id, subject_id) values (4, 6);
insert into teacher_subject (teacher_id, subject_id) values (4, 7);

insert into teacher_subject (teacher_id, subject_id) values (5, 6);
insert into teacher_subject (teacher_id, subject_id) values (5, 7);
insert into teacher_subject (teacher_id, subject_id) values (5, 1);
insert into teacher_subject (teacher_id, subject_id) values (5, 2);

-- select * from teacher
-- 	join teacher_subject on teacher.id = teacher_subject.teacher_id
-- 	join subject on teacher_subject.subject_id = subject.id;

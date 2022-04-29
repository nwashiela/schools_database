create or replace function 
 link_teacher_to_subject (teach_id int, sub_id int )
returns boolean as 

$$
begin

insert into teacher_subject(teacher_id,subject_id) values (teach_id, sub_id);

return true;

 end;
 $$
 Language plpgsql;

--  assign subtoteacer
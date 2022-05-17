create or replace function find_subjects_for_teachers (
	teachers_id int
)
	returns table(id int, name text) 

   as  
$$
begin

return query
select subject.* 
 from subject
  join teacher_subject on subject.id = teacher_subject.subject_id
  join teacher on teacher_subject.teacher_id = teacher.id
 where 
  teacher.id = teachers_id;

end;
$$
Language plpgsql;
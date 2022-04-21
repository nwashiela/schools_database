module.exports = function(pool) {

   create or replace function 
	find_teachers_teaching_multiple_subjects ()
	returns table(id int, first_name text, last_name text, email text, subject_count bigint) 
    as
   $$
declare our_count int;

begin
 return query 

select 
teacher.id,
   teacher.first_name, teacher.last_name, teacher.email, count(*)  
from teacher
	join teacher_subject on teacher.id = teacher_subject.teacher_id
	join subject on teacher_subject.subject_id = subject.id

group by 
teacher.id,
   teacher.first_name, teacher.last_name, teacher.email

having count(subject.name) > 1;

end;
$$
Language plpgsql;
}
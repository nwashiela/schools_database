module.exports = function (pool) {

	create or replace function 
	add_teacher ( f_name text, l_name text, email_gmail text )
	returns boolean as
   $$
declare 

total int;

begin

select into total count(*) from teacher
		where LOWER(email) = LOWER(email_gmail);

        if (total = 0) then
        insert into teacher (first_name, last_name,email ) values (f_name, l_name, email_gmail);
        return true;
	else
		return false;
	end if;

end;
$$
Language plpgsql;

-- \i functions/add_teacher.sql;
}
drop table teacher CASCADE;
create table teacher(
	id serial not null primary key,
	first_name text not null unique,
	last_name text not null,
	email text not null 
);
drop table subject CASCADE;
create table subject(
	id serial not null primary key,
	name text not null unique 	
);

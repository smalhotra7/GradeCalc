drop table if exists users;
create table users (
	id integer primary key autoincrement,
	user text not null,
	password text not null
);
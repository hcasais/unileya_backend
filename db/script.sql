CREATE schema unileya;

CREATE TABLE unileya.encurtador(
  chave character varying(64) NOT NULL,
  url character varying(2048) NOT NULL,
  url_curta character varying(256) NOT NULL,
  dt_cadastro timestamp without time zone NOT NULL DEFAULT now()
);

ALTER TABLE unileya.encurtador ADD CONSTRAINT encurtador_unique UNIQUE (chave);
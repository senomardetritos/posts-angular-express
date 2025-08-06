--
-- Adicionar photo na tabela usuários - 06/08/2025
--

ALTER TABLE `users` ADD `photo` LONGBLOB NOT NULL AFTER `password`;

SET GLOBAL max_allowed_packet=1073741824;
SHOW VARIABLES LIKE 'max_allowed_packet';

ALTER TABLE `users` CHANGE `photo` `photo` LONGBLOB NULL DEFAULT NULL;

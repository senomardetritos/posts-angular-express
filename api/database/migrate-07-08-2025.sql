--
-- Estrutura para tabela `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices de tabela `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `friends_users_id` (`user_id`),
  ADD KEY `friends_friend_id` (`friend_id`);

--
-- AUTO_INCREMENT de tabela `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_friend_id` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `friends_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;
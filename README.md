<div align="center">
  <h1>API GymPass</h1>
</div>

### RFs (Requisitos funcionais)

- [ ] Deve ser possível se cadastrar.
- [ ] Deve ser possível se autenticar.
- [ ] Deve ser possível obter o perfil de um usuário logado.
- [ ] Deve ser possível obter o número de check-ins realizados pelo usuário logado.
- [ ] Deve ser possível o usuário obter seu histórico de check-ins.
- [ ] Deve ser possível o usuário buscar academias próximas.
- [ ] Deve ser possível o usuário buscar academias pelo nome.
- [ ] Deve ser possível o usuário realizar check-in em uma academia.
- [ ] Deve ser possível validar o check-in de um usuário.
- [ ] Deve ser possível cadastrar uma academia.

### RNs (Regra de negócio)

- [ ] O usuário não deve poder se cadastrar com um e-amil duplicado.
- [ ] O usuário não pode fazer 2 check-ins no mesmo dia.
- [ ] O usuário não pode fazer check-in se não estiver perto (100m) de academia.
- [ ] O check-in só pode ser validado até 20 minutos após criado.
- [ ] O check-in só pode ser validado por administradores.
- [ ] A academia só pode ser cadastrada por administradores.

### RNFs (Requisitos não-funcionais)

- [ ] A senha do usuário precisa estar criptografada.
- [ ] Os dado da aplicação precisam estar persistidos em um banco PostgreSQL.
- [ ] Todas listas de dados precisam estar paginadas com 20 itens por página.
- [ ] O usuário deve ser identificado por JWT (JSON web Token).

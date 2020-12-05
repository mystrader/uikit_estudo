# UIKit.PJe.JUS - Seed

## Descrição
Projeto Raiz a ser utilizado (clonado) como base (remote) ao iniciar um novo sistema. Este projeto utiliza o tema gerado no UIKit.

## Tecnologias
> #### Angular
> - **7.2**
> - https://angular.io/

> #### AngularCLI 
> - https://cli.angular.io/

> #### Angular Material Design
> - https://material.angular.io/

> #### Font Awesome
> - https://fontawesome.com/

> #### Bootstrap (apenas gridsystem)
> - https://getbootstrap.com/

> #### Akita
> - https://netbasal.gitbook.io/akita/


## Iniciando

```sh
# Install global dependencies
npm install --global @angular/cli typescript

# Clone this repo giving your new project name
git clone https://git.cnj.jus.br/uikit/uikit-seed.git [your-project-name]

cd [your-project-name]

# Set your origin repository (can be later if wanted to)
git remote set-url origin [your-project-git-repo]

# Add this repository as upstream (to keep updated)
git remote add upstream https://git.cnj.jus.br/uikit/uikit-seed.git

# Install the project's dependencies
npm install

# (Optionally) Start the project
npm run start
```

### Gerando telas
```sh
# Comando para gerar telas (CRUD) a partir de um schema
ng g crud --name=localidade --obj="{'id':'number', 'title':'string'}" --force

# Comando para gerar telas (CRUD) a partir de uma API
ng g crud --name=breweries --url=https://api.openbrewerydb.org/breweries --force
```

### Atualizando (seu projeto com base no seed - _padrão de fork_)
```sh
git fetch upstream
git merge upstream/master
```

### VSCode
É possível fazer o debug via VSCode apenas pressionando `F5`

## Repositórios Vinculados
> #### UIKit
> - Contém os arquivos de código-fonte do projeto (estilos e componentes)
> - https://git.cnj.jus.br/uikit/uikit

> #### UIKit.PJe.Jus - Design
> - Projeto contendo repositórios referente a Interface Gráfica dos sistemas da Justiça
> - https://git.cnj.jus.br/uikit/ui.pje.jus

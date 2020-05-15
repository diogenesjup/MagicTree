window.addEventListener('load', function() {

    /* Declarando Views */
    $JSView.declareView({

        viewBooks: {
            url: '/viewBooks',
            template: 'views/viewBooks.html',
            controller: 'viewBooks'
        },

        viewTeste: {
            url: '/viewTeste',
            template: 'views/viewTeste.html',
            controller: 'viewTeste'
        },

        viewBooksUnits: {
            url: '/viewBooksUnits',
            template: 'views/viewBooksUnits.html',
            controller: 'viewBooksUnits'
        },

        viewBooksUnitsPdf: {
            url: '/viewBooksUnitsPdf',
            template: 'views/viewBooksUnitsPdf.html',
            controller: 'viewBooksUnitsPdf'
        },



        viewSongs: {
            url: '/viewSongs',
            template: 'views/viewSongs.html',
            controller: 'viewSongs'
        },
        viewVideos: {
            url: '/viewVideos',
            template: 'views/viewVideos.html',
            controller: 'viewVideos'
        },


        viewManageAccount: {
            url: '/viewManageAccount',
            template: 'views/viewManageAccount.html',
            controller: 'viewManageAccount'
        },
        viewAccessKey: {
            url: '/viewAccessKey',
            template: 'views/viewAccessKey.html',
            controller: 'viewAccessKey'
        },
        viewAddAccessKey: {
            url: '/viewAddAccessKey',
            template: 'views/viewAddAccessKey.html',
            controller: 'viewAddAccessKey'
        },

        viewGetHelp: {
            url: '/viewGetHelp',
            template: 'views/viewGetHelp.html',
            controller: 'viewGetHelp'
        },

        viewReportAbuse: {
            url: '/viewReportAbuse',
            template: 'views/viewReportAbuse.html',
            controller: 'viewReportAbuse'
        },


        viewGames: {
            url: '/viewGames',
            template: 'views/viewGames.html',
            controller: 'viewGames'
        },

        viewMemoryGame: {
            url: '/viewMemoryGame',
            template: 'views/viewMemoryGame.html',
            controller: 'viewMemoryGame'
        },
        viewMathingGame: {
            url: '/viewMathingGame',
            template: 'views/viewMathingGame.html',
            controller: 'viewMathingGame'
        },
        viewDragAndDrop: {
            url: '/viewDragAndDrop',
            template: 'views/viewDragAndDrop.html',
            controller: 'viewDragAndDrop'
        },

        viewComunidade: {
            url: '/viewComunidade',
            template: 'views/viewComunidade.html',
            controller: 'viewComunidade'
        },

        viewEnviarComunidade: {
            url: '/viewEnviarComunidade',
            template: 'views/viewEnviarComunidade.html',
            controller: 'viewEnviarComunidade'
        },

        viewTreinamento: {
            url: '/viewTreinamento',
            template: 'views/viewTreinamento.html',
            controller: 'viewTreinamento'
        },

        viewDetalheAtividade: {
            url: '/viewDetalheAtividade',
            template: 'views/viewDetalheAtividade.html',
            controller: 'viewDetalheAtividade'
        },

        viewEditarDetalheAtividade: {
            url: '/viewEditarDetalheAtividade',
            template: 'views/viewEditarDetalheAtividade.html',
            controller: 'viewEditarDetalheAtividade'
        },

        viewConfirmarApagarAtividade: {
            url: '/viewConfirmarApagarAtividade',
            template: 'views/viewConfirmarApagarAtividade.html',
            controller: 'viewConfirmarApagarAtividade'
        }
       

    });

    /* DEFININDO A VIEW INICIAL DO APLICATIVO  */
    $JSView
        .initView('viewBooks');

}, false);

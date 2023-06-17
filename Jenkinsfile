pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose build'
                sh 'docker-compose up -d'
            }
        }
        // stage('Deploy') {
        //     steps {
        //         sh 'docker stop cont_plannr || true'
        //         sh 'docker rm cont_plannr || true'
        //         sh 'docker run -d --name cont_plannr -p 3080:3080 img_plannr'
        //     }
        // }
    }
}

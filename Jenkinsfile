pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t img_prerak_frontend .'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker stop cont_prerak_frontend || true'
                sh 'docker rm cont_prerak_frontend || true'
                sh 'docker run -d --name cont_prerak_frontend -p 3000:3000 img_prerak_frontend'
            }
        }
    }
}

pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_NAME_SERVER = 'rahat-coder971/liv-whiteboard-server'
        IMAGE_NAME_CLIENT = 'rahat-coder971/liv-whiteboard-client'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Build Server') {
            steps {
                echo '🏗️  Building Server Docker image...'
                dir('server') {
                    sh 'docker build -t ${IMAGE_NAME_SERVER}:${IMAGE_TAG} .'
                    sh 'docker tag ${IMAGE_NAME_SERVER}:${IMAGE_TAG} ${IMAGE_NAME_SERVER}:latest'
                }
            }
        }

        stage('Build Client') {
            steps {
                echo '🏗️  Building Client Docker image...'
                dir('client') {
                    sh 'docker build -t ${IMAGE_NAME_CLIENT}:${IMAGE_TAG} .'
                    sh 'docker tag ${IMAGE_NAME_CLIENT}:${IMAGE_TAG} ${IMAGE_NAME_CLIENT}:latest'
                }
            }
        }

        stage('Test') {
            steps {
                echo '✅ Running tests...'
                script {
                    // Optional: Add your test commands here
                    // sh 'cd server && npm test'
                    // sh 'cd client && npm test'
                    echo 'Tests completed (Add your test commands as needed)'
                }
            }
        }

        stage('Push to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                echo '📤 Pushing images to Docker Hub...'
                script {
                    // Uncomment and add your Docker Hub credentials in Jenkins
                    // withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    //     sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    //     sh 'docker push ${IMAGE_NAME_SERVER}:${IMAGE_TAG}'
                    //     sh 'docker push ${IMAGE_NAME_SERVER}:latest'
                    //     sh 'docker push ${IMAGE_NAME_CLIENT}:${IMAGE_TAG}'
                    //     sh 'docker push ${IMAGE_NAME_CLIENT}:latest'
                    // }
                    echo 'Docker images ready to push (Add Docker Hub credentials in Jenkins)'
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying application...'
                script {
                    // Optional: Add your deployment commands here
                    // sh 'docker-compose up -d'
                    echo 'Deployment completed (Add your deployment commands as needed)'
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up...'
            // Clean workspace
            cleanWs()
        }
        success {
            echo '✨ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
    }
}

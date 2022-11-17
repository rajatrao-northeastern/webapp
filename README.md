# CSYE6225: Assignment-08

This is a README file of Assignment_04 for the course INFO6225.

1. Clone the repository.
```bash
git clone <repo SSH protocol>
```

2. Navigate to project directory.
```bash
cd <path to cloned directory>
```

3. Run 
```bash
npm install
```

4. Install Browser/Postman to view running application.
```bash
npm start
```
5. Run Packer command 
```bash
    packer build <file name .pkr.hcl>
```
6. Run AWS Cloud Formation Command by Passing the parameter
```bash
aws cloudformation create-stack --stack-name teststack14 --template-body file://csye6225-infra.yaml --parameters ParameterKey=VpcCidrBlock,ParameterValue=10.0.0.0/16 ParameterKey=SubnetCidrBlock1,ParameterValue=10.0.1.0/24 ParameterKey=SubnetCidrBlock2,ParameterValue=10.0.2.0/24 ParameterKey=SubnetCidrBlock3,ParameterValue=10.0.3.0/24 ParameterKey=ImageId,ParameterValue=' AMI-ID’
```
## Technologies

Language: JavaScript,

Runtime Environment: NodeJs, 
 
FrameWork: ExpressJs

Database: MySql


## Developed by

Rajat Rao-002987057
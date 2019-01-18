---
title: How to setup static front-end website on AWS EC2
date: '2017-03-08T12:12:03.284Z'
---

People might be thinking, why I selected AWS EC2 to setup static front-end website which can run on any shared hosting apache server or can also be deployed on s3. So here is my answer

- I wanted to automate the process of deployment. Creating .zip files and uploading them to some shared hosting is really pain, when you have to continuously deliver product. Like there were times when I had to deploy twice or thrice a day and It was really painful. So I decided to go with AWS EC2 instance where I can set up my own Apache Server and can automate part of deployment using git.

- If I would have selected s3 for deployment than I might not have benefit of gziping things using .htaccess file

- To handle more concurrent requests compared to Shared Hosting

- Easily scalable

Now when you are creating your own server on cloud services like AWS / Digital Ocean / Google Cloud Platform, etc. You have to take care of many things. Following are the requirements that I had to take care while deploying website

- It should be secured website, i.e. it should work over https protocol and not http protocol. So here comes a pain, I have to install TLS and SSL Certificates on Apache server that I was going to setup on EC2

- Multiple subdomains can be hosted on this server

So now Lets Start

## How to setup Apache on EC2

### Step 1 — AWS and EC2 setup

- Create account on http://aws.amazon.com/
- Signing into amazon console https://console.aws.amazon.com/
- Select Amazon EC2 from Services and Launch Ubuntu instance (Apache set up steps might be different if you choose different OS)
- Once that is done you will have 2 things (1) .pem file and (2) IP address of your instance
- This IP address will be used to point your domain to EC2 hosting. So you can change CNAME record for your domain and have this IP address there.
- If you are Linux / Mac users you can directly sign in into EC2 instance from your terminal and can access your instance. Windows user can use PUTTY to access the remote system.
- You can login into remote system using ssh. You can find ssh login command in the information of your instance. For login using ssh you will have to use .pem file that you must have downloaded while creating instance. Make sure you secure this file. (If you don’t know the command then here it is — `ssh -i test.pem ubuntu@ec2–51–21–22–64.compute-1.amazonaws.com`) make sure you replace your .pem file path and name and ec2 public DNS. If it throws permission error. than please change permission of pem file to “600”, i.e. chmod 600 test.pem

### Step 2 — Apache Setup

- Consider it as raw ubuntu machine. So first of all you will have to install apache2 on it. So here is the command for that

```
sudo apt-get install apache2
```

- Once the apache2 is installed you will have to start apache Services using the following command

```
sudo systemctl start apache2.service
```

So now if you have pointed your domain to the IP address of EC2 then you can hit the domain in browser and you will see apache default page. From where it is served ?
Following is the path where your website files reside
`/var/www/html`
So you have to copy your files to this folder in order to start. You can setup git in your instance and just pull code over here Easiest way to deploy the code :D. Also you can automate this process by integrating some CI/CD tools

### How to Setup SSL / TLS for secure website

In order to setup ssl/tls certificate you need to have .crt file and .key file of from where ever you have purchased certificate for your domain. You can purchase it from different domain / certificate providers like Godaddy / Hostgator, etc. If there is chain of security authorities involved in then there might be bundle certificate available as well.
Now upload this files to EC2 instance that you have created. You can upload it using any FTP with the help of .pem file.

Copy these certificate file to apache `/etc/ssl` folder.

All your apache configuration resides in `/etc/apache2/`. Configuration for various hosts, their respective serving directory, ssl tls configuration for the host, etc resides here. Default config file will be `/etc/apache2/sites-enabled/000-default.conf`. This are the virtual host configuration and mainly used by http protocol. in this file u can define from where you would like to server your website files default it will be `/var/www/html`. We can create ssl config file in `/etc/apache2/sites-enabled/`. Following are the steps

- `sudo -s (root access)`
- `cd /etc/apache2/sites-enabled`
- `vim default-ssl.conf` (if vim is not installed you can use any other editor of your choice or can install vim using `sudo apt-get install vim`)
- And add following content to it. Make sure you replace name and path of your certificate file and private key file

```
<IfModule mod_ssl.c>
  <VirtualHost _default_:443>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
    SSLEngine on
    SSLCertificateFile      /etc/ssl/certs/test.crt
    SSLCertificateKeyFile /etc/ssl/private/private.key
    SSLCertificateChainFile /etc/ssl/certs/test_bundle.crt
    <FilesMatch "\.(cgi|shtml|phtml|php)$">
      SSLOptions +StdEnvVars
    </FilesMatch>
    <Directory /usr/lib/cgi-bin>
      SSLOptions +StdEnvVars
    </Directory>
  </VirtualHost>
</IfModule>
```

- Thats it now you have successfully setup your ssl/tls certificate you can restart you apache server and see the changes

### How to setup multiple domain on Same Server

In order to setup another domain or subdomain on this server you just need to add another virtual host config file and that will do your work. Following are the steps to do that

- Copy `/etc/apache2/sites-enabled/000-default.conf` and create new file using that with name of your domain. Example

```
cp /etc/apache2/sites-enabled/000-default.conf /etc/apache2/sites-enabled/domain.com.conf
```

- Than just change the name of your serving directory in the newly created host config file.

- Thats it you are done :)

While I was setting up this whole architecture for serving my website files following were the links that really helped me to go through.

- https://nouveauframework.org/blog/vhosts-running-multiple-sites-on-a-single-aws-ec2-instance/
- https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-14-04-lts
- https://www.digitalocean.com/community/tutorials/how-to-create-a-ssl-certificate-on-apache-for-ubuntu-14-04

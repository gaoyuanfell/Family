# mongoose 用法
##Schema - 表结构

1.构造函数

    new mongoose.Schema( { name:{type:String}, age:{type:Number, default:10} } )

2.添加属性

    Schema.add( { name: 'String', email: 'String', age: 'Number' } )

3.有时候Schema不仅要为后面的Model和Entity提供公共的属性，还要提供公共的方法

    Schema.method( 'say', function(){console.log('hello');} ) //这样Model和Entity的实例就能使用这个方法了

4.添加静态方法

    Schema.static( 'say', function(){console.log('hello');} ) //静态方法，只限于在Model层就能使用

5.追加方法

    Schema.methods.say = function(){console.log('hello');}; //静态方法，只限于在Model层就能使用

##修改器和更新器

'$inc' 增减修改器,只对数字有效.下面的实例: 找到 age=22的文档,修改文档的age值自增1

    Model.update({'age':22}, {'$inc':{'age':1} } ); 执行后: age=23

'$set' 指定一个键的值,这个键不存在就创建它.可以是任何MondoDB支持的类型.

    Model.update({'age':22}, {'$set':{'age':'haha'} } ); 执行后: age='haha'

'$unset' 同上取反,删除一个键

    Model.update({'age':22}, {'$unset':{'age':'haha'} } ); 执行后: age键不存在
    
##数组修改器
'$push' 给一个键push一个数组成员,键不存在会创建

    Model.update({'age':22}, {'$push':{'array':10} } ); 执行后: 增加一个 array 键,类型为数组, 有一个成员 10

'$addToSet' 向数组中添加一个元素,如果存在就不添加

    Model.update({'age':22}, {'$addToSet':{'array':10} } ); 执行后: array中有10所以不会添加

'$each' 遍历数组, 和 $push 修改器配合可以插入多个值

    Model.update({'age':22}, {'$push':{'array':{'$each': [1,2,3,4,5]}} } ); 执行后: array : [10,1,2,3,4,5]

'$pop' 向数组中尾部删除一个元素

    Model.update({'age':22}, {'$pop':{'array':1} } ); 执行后: array : [10,1,2,3,4] tips: 将1改成-1可以删除数组首部元素

'$pull' 向数组中删除指定元素

    Model.update({'age':22}, {'$pull':{'array':10} } ); 执行后: array : [1,2,3,4] 匹配到array中的10后将其删除
    
##条件查询
'$lt'   小于
'$lte'  小于等于
'$gt'   大于
'$gte'  大于等于
'$ne'   不等于

    Model.find({"age":{ "$get":18 , "$lte":30 } } );

##或查询 OR

'$in'   一个键对应多个值
'$nin'  同上取反, 一个键不对应指定值
'$or'   多个条件匹配, 可以嵌套 $in 使用
'$not'  同上取反, 查询与特定模式不匹配的文档

    Model.find({"age":{ "$in":[20,21,22.'haha']} } );
    Model.find({"$or" : [ {'age':18} , {'name':'xueyou'} ] }); 查询 age等于18 或 name等于'xueyou' 的文档

##类型查询

    Model.find('age' : { '$in' : [null] , 'exists' : true } ); 查询 age值为null的文档
    
##正则表达式

    find( {"name" : /joe/i } )//查询name为 joe 的文档, 并忽略大小写
    find( {"name" : /joe?/i } ) 查询匹配各种大小写组合
    
##查询数组

    Model.find({"array":10} ); 查询 array(数组类型)键中有10的文档, array : [1,2,3,4,5,10] 会匹配到
    Model.find({"array[5]":10} ); 查询 array(数组类型)键中下标5对应的值是10, array : [1,2,3,4,5,10] 会匹配到
    
'$all' 匹配数组中多个元素
    
    Model.find({"array":[5,10]} ); 查询 匹配array数组中 既有5又有10的文档
    
'$size' 匹配数组长度

    Model.find({"array":{"$size" : 3} } ); 查询 匹配array数组长度为3 的文档
    
'$slice' 查询子集合返回

    Model.find({"array":{"$slice" : 10} } ); 查询 匹配array数组的前10个元素
    
    Model.find({"array":{"$slice" : [5,10] } } ); 查询 匹配array数组的第5个到第10个元素
    
##where

    find({'$where':function(){
        for( var x in this ){
            //这个函数中的 this 就是文档
        }
        
    }})
    
    简化：
    find( {"$where" :  "this.x + this.y === 10" } )
    find( {"$where" : " function(){ return this.x + this.y ===10; } " } )
    
    
    
#暂需框架
1.Koa
2.Bluebird
3.TokuMX
4.koajs
5.hiredis 

#ubuntu 安装mongodb
    开机自启动
    export PATH=$PATH:/opt/mongodb/bin
    mongod --dbpath /opt/mongodb/data/db/ --logpath /opt/mongodb/data/logs/mongodb.log --logappend &
    ./mongod --dbpath /d/Program\ Files/MongoDB/data/db/ --logpath /d/Program\ Files/MongoDB/data/log/mongodb.log --logappend &

#windows 安装mongodb
mongod.exe --logpath "d:\Program Files\MongoDB\data\log\mongodb.log" --logappend --dbpath "d:\Program Files\MongoDB\data\db" --serviceName MongoDB --serviceDisplayName MongoDB --install

###修改Collection名称 
    db.getCollection('Agency').renameCollection('Organize')

##mongod的主要参数有

    --quiet # 安静输出
    --port arg # 指定服务端口号，默认端口27017
    --bind_ip arg # 绑定服务IP，若绑定127.0.0.1，则只能本机访问，不指定默认本地所有IP
    --logpath arg # 指定MongoDB日志文件，注意是指定文件不是目录
    --logappend # 使用追加的方式写日志
    --pidfilepath arg # PID File 的完整路径，如果没有设置，则没有PID文件
    --keyFile arg # 集群的私钥的完整路径，只对于Replica Set 架构有效
    --unixSocketPrefix arg # UNIX域套接字替代目录,(默认为 /tmp)
    --fork # 以守护进程的方式运行MongoDB，创建服务器进程
    --auth # 启用验证
    --cpu # 定期显示CPU的CPU利用率和iowait
    --dbpath arg # 指定数据库路径
    --diaglog arg # diaglog选项 0=off 1=W 2=R 3=both 7=W+some reads
    --directoryperdb # 设置每个数据库将被保存在一个单独的目录
    --journal # 启用日志选项，MongoDB的数据操作将会写入到journal文件夹的文件里
    --journalOptions arg # 启用日志诊断选项
    --ipv6 # 启用IPv6选项
    --jsonp # 允许JSONP形式通过HTTP访问（有安全影响）
    --maxConns arg # 最大同时连接数 默认2000
    --noauth # 不启用验证
    --nohttpinterface # 关闭http接口，默认关闭27018端口访问
    --noprealloc # 禁用数据文件预分配(往往影响性能)
    --noscripting # 禁用脚本引擎
    --notablescan # 不允许表扫描
    --nounixsocket # 禁用Unix套接字监听
    --nssize arg (=16) # 设置信数据库.ns文件大小(MB)
    --objcheck # 在收到客户数据,检查的有效性，
    --profile arg # 档案参数 0=off 1=slow, 2=all
    --quota # 限制每个数据库的文件数，设置默认为8
    --quotaFiles arg # number of files allower per db, requires --quota
    --rest # 开启简单的rest API
    --repair # 修复所有数据库run repair on all dbs
    --repairpath arg # 修复库生成的文件的目录,默认为目录名称dbpath
    --slowms arg (=100) # value of slow for profile and console log
    --smallfiles # 使用较小的默认文件
    --syncdelay arg (=60) # 数据写入磁盘的时间秒数(0=never,不推荐)
    --sysinfo # 打印一些诊断系统信息
    --upgrade # 如果需要升级数据库  * Replicaton 参数
    --fastsync # 从一个dbpath里启用从库复制服务，该dbpath的数据库是主库的快照，可用于快速启用同步
    --autoresync # 如果从库与主库同步数据差得多，自动重新同步，
    --oplogSize arg # 设置oplog的大小(MB)  * 主/从参数
    --master # 主库模式
    --slave # 从库模式
    --source arg # 从库 端口号
    --only arg # 指定单一的数据库复制
    --slavedelay arg # 设置从库同步主库的延迟时间  * Replica set(副本集)选项：
    --replSet arg # 设置副本集名称  * Sharding(分片)选项
    --configsvr # 声明这是一个集群的config服务,默认端口27019，默认目录/data/configdb
    --shardsvr # 声明这是一个集群的分片,默认端口27018
    --noMoveParanoia # 关闭偏执为moveChunk数据保存
    
##整库备份
    mongodump -h dbhost -d dbname -o dbdirectory
    mongodump -h 127.0.0.1 -d moka -o ~/github/Family/public/mongodb/back/
    mongodump.exe -h 127.0.0.1 -d moka -o /d/work/Family/mongodbBack/mongodb/back
    mongodump -h 127.0.0.1 -d moka -o public/mongodb/back/
    -h：MongDB所在服务器地址，例如：127.0.0.1，当然也可以指定端口号：127.0.0.1:27017
    -d：需要备份的数据库实例，例如：test
    -o：备份的数据存放位置，例如：c:\data\dump，当然该目录需要提前建立，在备份完成后，系统自动在dump目录下建立一个test目录，这个目录里面存放该数据库实例的备份数据。
    
##整库恢复
    mongorestore -h dbhost -d dbname dbdirectory
    mongorestore -h 127.0.0.1 -d moka public/mongodb/back/moka
    -h：MongoDB所在服务器地址
    -d：需要恢复的数据库实例，例如：test，当然这个名称也可以和备份时候的不一样，比如test2
    –directoryperdb：备份数据所在位置，例如：c:\data\dump\test，这里为什么要多加一个test，而不是备份时候的dump，读者自己查看提示吧！
    –drop：恢复的时候，先删除当前数据，然后恢复备份的数据。就是说，恢复后，备份后添加修改的数据都会被删除，慎用哦！
    
# 表结构
    

#ubuntu 安装redis
    1.下载源码http://redis.io/download
    2.解压进入目录 make && make install
    3.将××/utils/redis_init_script 拷贝到/etc/init.d/ 下
    3.将××/redis.conf 拷贝到/etc/redis/ 下
    5.安装sysv-rc-conf sudo apt-get install sysv-rc-conf
    
#ngrok

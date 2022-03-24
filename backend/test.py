# import pymysql
# import sqlalchemy
from google.cloud.sql.connector import connector
import flask
from flask import Flask,render_template,request,send_from_directory
import json
import sqlite3
import requests
import sys
from datetime import datetime
from flask_cors import CORS
import re
import threading
mutex =threading.Lock()
app = Flask(__name__)
CORS(app)
conn = connector.connect(
    "festive-planet-281310:us-central1:cs4111",
    "pymysql",
    user="root",
    password='Xu440987',
    db="411newnew",
)

cursor = conn.cursor()


@app.route("/photo_url", methods=['GET'])
def photo_url():
    
    cursor.execute("SELECT photo from People LIMIT 20")

    # Fetch the results
    result = cursor.fetchall()

    result = [i[0] for i in result]

    return {'rec':result}

@app.route("/search_list_by_name",methods=["POST", "GET"])
def search_list_by_name():
    data = request.get_json(force=True)
    name = data["name"]
    mutex.acquire()
    cursor.execute("SELECT list_id from List where name='{}'".format(name))
    result = cursor.fetchall()
    mutex.release()
    result = [i for i in result]
    if result:
        return {'rec': result}
    else:
        return {'rec': 0}

@app.route("/search_movie",methods=["POST", "GET"])
def search_movie():
    data = request.get_json(force=True)
    lan = data["language"]
    typ = data["type"]
    key = data["keyword"]
    isa = data["isActor"]

    if key and not isa:
        key_sql = "SELECT DISTINCT movie.movie_id, movie.title, movie.release_year, movie.runtime, movie.type, movie.description, movie.cover, movie.production, movie.language from movie where movie.title LIKE '%{}%'".format(key)
    elif key and isa:
        key_sql = "SELECT DISTINCT movie.movie_id, movie.title, movie.release_year, movie.runtime, movie.type, movie.description, movie.cover, movie.production, movie.language from movie INNER JOIN mp on movie.movie_id=mp.tconst INNER JOIN People ON People.peopleid=mp.nconst where People.name LIKE '%{}%'".format(key)
    else:
        key_sql = "SELECT DISTINCT movie.movie_id, movie.title, movie.release_year, movie.runtime, movie.type, movie.description, movie.cover, movie.production, movie.language from movie"

    typ_sql_sent = ""
    for typ_key, typ_value in typ.items():
        if typ_value:
            if typ_sql_sent:
                typ_sql_sent += " UNION "
            if key_sql:
                typ_sql_sent += "SELECT DISTINCT movie.movie_id, movie.title, movie.release_year, movie.runtime, movie.type, movie.description, movie.cover, movie.production, movie.language from movie where movie.type = '{}' and (movie.movie_id, movie.title, movie.release_year, movie.runtime, movie.type, movie.description, movie.cover, movie.production, movie.language) in ({})".format(typ_key, key_sql)
            else:
                typ_sql_sent += "SELECT DISTINCT movie.movie_id, movie.title, movie.release_year, movie.runtime, movie.type, movie.description, movie.cover, movie.production, movie.language from movie where movie.type = '{}'".format(typ_key)
    if not typ_sql_sent:
        typ_sql_sent = key_sql
    
    cursor.execute(typ_sql_sent)
    result_type = cursor.fetchall()
    res_typ = []
    for i in result_type:
        ret_typ = {}
        i = list(i)
        ret_typ["movie_id"] = i[0]
        ret_typ["title"] = i[1]
        ret_typ["release_year"] = i[2]
        ret_typ["runtime"] = i[3]
        if i[4] == "\\N":
            i[4] = ""
        ret_typ["type"] = i[4]
        ret_typ["description"] = i[5]
        ret_typ["cover"] = i[6]
        ret_typ["production"] = i[7]
        if i[8][0] == "s":
            i[8] = ",".join(re.findall('[A-Z][^A-Z]*', i[8][1:]))
        ret_typ["language"] = i[8]
        res_typ.append(ret_typ)
    # result_type = set([i for i in result_type])

    lan_sql_sent = ""
    
    for lan_key, lan_value in lan.items():
        if lan_value:
            if lan_sql_sent:
                lan_sql_sent += " UNION "
            if key_sql:
                lan_sql_sent += "SELECT DISTINCT movie.movie_id, movie.title, movie.release_year, movie.runtime, movie.type, movie.description, movie.cover, movie.production, movie.language from movie where movie.language = '{}' and (movie.movie_id, movie.title, movie.release_year, movie.runtime, movie.type, movie.description, movie.cover, movie.production, movie.language) in ({})".format(lan_key, key_sql)
            else:
                lan_sql_sent += "SELECT DISTINCT movie.movie_id, movie.title, movie.release_year, movie.runtime, movie.type, movie.description, movie.cover, movie.production, movie.language from movie where movie.language = '{}'".format(lan_key)
    if not lan_sql_sent:
        lan_sql_sent = key_sql
    mutex.acquire()
    cursor.execute(lan_sql_sent)
    result_lang = cursor.fetchall()
    mutex.release()
    res_lang = []
    for i in result_lang:
        ret_lang = {}
        i = list(i)
        ret_lang["movie_id"] = i[0]
        ret_lang["title"] = i[1]
        ret_lang["release_year"] = i[2]
        ret_lang["runtime"] = i[3]
        if i[4] == "\\N":
            i[4] = ""
        ret_lang["type"] = i[4]
        ret_lang["description"] = i[5]
        ret_lang["cover"] = i[6]
        ret_lang["production"] = i[7]
        if i[8][0] == "s":
            i[8] = ",".join(re.findall('[A-Z][^A-Z]*', i[8][1:]))
        ret_lang["language"] = i[8]
        res_lang.append(ret_lang)
    # result_lang = set([i for i in result_lang])

    # isa_sql = ""
    # if isa:
    #     isa_sql = "SELECT title from movie INNER JOIN mp on movie.movie_id=mp.tconst INNER JOIN People ON People.peopleid=mp.nconst where People.name LIKE '%{}%' and title in ({})".format(key, lan_sql_sent)
    # if not isa_sql:
    #     isa_sql = lan_sql_sent

    # print(result_type)
    # print(result_lang)
    
    # cursor.execute(lan_sql_sent)

    # # Fetch the results
    # result = cursor.fetchall()
    result = []
    for i in res_typ:
        if i in res_lang:
            result.append(i)

    if result:
        return {'rec': result[:20]}
    else:
        return {'rec': 0}

@app.route("/get_all_movies",methods=["POST"])
def get_all_movies():
    data = request.get_json(force=True)

    m_id = data["movie_id"]
    mutex.acquire()
    cursor.execute("SELECT movie.movie_id, title, release_year, runtime, type, description, cover, production, language, peopleid, category from movie LEFT JOIN mp on movie.movie_id=mp.tconst LEFT JOIN People ON People.peopleid=mp.nconst where movie.movie_id='{}'".format(m_id))
    result = cursor.fetchall()
    mutex.release()

    mutex.acquire()
    cursor.execute("SELECT AVG(rating) FROM rating  where movie_id='{}' GROUP BY movie_id".format(m_id))
    rating_result = cursor.fetchall()
    mutex.release()


    ret = {}
    if rating_result:
        ret["rating"] = int(rating_result[0][0])
    else:
        ret["rating"] = 5
    for i in result:
        i = list(i)
        ret["movie_id"] = i[0]
        ret["title"] = i[1]
        ret["release_year"] = i[2]
        ret["runtime"] = i[3]
        if i[4] == "\\N":
            i[4] = ""
        ret["type"] = i[4]
        ret["description"] = i[5]

        ret["cover"] = i[6]
        ret["production"] = i[7]
        if i[8][0] == "s":
            i[8] = ",".join(re.findall('[A-Z][^A-Z]*', i[8][1:]))
        ret["language"] = i[8]
        if i[9] and i[10]:
            if "peopleid_and_job" in ret:
                ret["peopleid_and_job"].append(i[9]+":"+i[10])
            else:
                ret["peopleid_and_job"] = [i[9]+":"+i[10]]
        else:
            ret["peopleid_and_job"] = []
    return {'rec':ret}

@app.route("/get_all_people",methods=["POST", "GET"])
def get_all_people():
    data = request.get_json(force=True)
    p_id = data["peopleid"]
    mutex.acquire()
    cursor.execute("SELECT * from People where peopleid='{}'".format(p_id))
    result = cursor.fetchall()
    mutex.release()
    ret = {}
    result = list(result[0])
    ret["peopleid"] = result[0]
    ret["name"] = result[1]
    ret["date_of_birth"] = result[2]
    ret["profession"] = result[3]
    ret["bio"] = result[4]
    ret["photo"] = result[5]
    ret["place_of_birth"] = result[6]
    return {'rec':ret}

@app.route("/get_all_reviews",methods=["POST", "GET"])
def get_all_reviews():
    data = request.get_json(force=True)
    r_id = data["reviewId"]
    cursor.execute("SELECT reviewId, rating from Reviews where reviewId='{}'".format(r_id))
    result = cursor.fetchall()
    ret = {}
    result = list(result[0])
    ret["reviewId"] = result[0]
    ret["rating"] = result[1]
    return {'rec':ret}

@app.route("/get_movie_review",methods=["POST", "GET"])
def get_movie_review():
    data = request.get_json(force=True)
    m_id = data["movie_id"]
    cursor.execute("SELECT reviewId, rating, MoviesmovieId from Reviews where MoviesmovieId='{}'".format(m_id))
    result = cursor.fetchall()
    ret = {}
    result = list(result[0])
    ret["reviewId"] = result[0]
    ret["rating"] = result[1]
    ret["MoviesmovieId"] = result[2]
    return {'rec':ret}

@app.route("/advanced_search_movie/", methods=['POST'])
def advanced_search_movie(tag):
    data = request.get_json(force=True)
    # The type of data {'request_query':[
    # {
    #  'language':xxx,
    #  'max_runtime': xxx,
    #  'type':xxx
    # }]}


    cursor.execute("SELECT title from movie where tag='{}'".format(tag))

    # Fetch the results
    result = cursor.fetchall()

    result = [i[0] for i in result]

    return {'rec':result}

@app.route("/register", methods=["POST"])
def register():

    data = request.get_json(force=True)
    email = data['email']
    mutex.acquire()

    cursor.execute("SELECT count(*) from user where email='{}'".format(email))
    mutex.release()
    count = cursor.fetchall()[0][0]

    if count > 0:
        return {"rec": 0}
    else:
        mutex.acquire()
        cursor.execute("INSERT INTO user VALUES ('{}','{}','{}','{}','{}','')".format(data['username'],email,data['password'],data['gender'], data['birthday']))
        conn.commit()
        mutex.release()
        return {"rec": 1}


@app.route("/login", methods=["POST"])
def login():

    data = request.get_json(force=True)
    email = data['email']
    mutex.acquire()
    cursor.execute("SELECT email, username, password, gender, birthday from user where email='{}' and password='{}'".format(email,data['password']))
    mutex.release()
    result = cursor.fetchall()

    if len(result) == 0:
        return {"rec": 0}
    else:
        result = result[0]
        return {"rec": {"email":result[0], 'username':result[1], "password":result[2], "gender":result[3], "birthday":datetime.strftime(result[4],'%Y-%m-%d')}}



@app.route("/update_user", methods=["POST", "GET"])
def update_user():

    data = request.get_json(force=True)
    email = data['email']
    cursor.execute(
        "UPDATE user SET username='{}', password='{}', gender='{}', birthday='{}' where email='{}'".format(
            data['username'], data['password'], data['gender'], data['birthday'], email))
    
    
    conn.commit()
    
    cursor.execute("SELECT count(*) from user where email='{}'".format(email))
    count = cursor.fetchall()[0][0]
   
    if count > 0:
        return {"rec": 0}
    else:
        return {"rec": 1}

    # return {"rec": count}


@app.route("/delete_user", methods=["POST"])
def delete_user():

    data = request.get_json(force=True)
    email = data['email']
    mutex.acquire()
    cursor.execute("DELETE FROM user WHERE email='{}'".format(email))
    conn.commit()
   
    cursor.execute("SELECT count(*) from user where email='{}'".format(email))
    mutex.release()
    count = cursor.fetchall()[0][0]

    if count > 0:
        return {"rec": 0}
    else:
        return {"rec": 1}

    # return {"rec": count}


# @app.route("/delete_list", methods=["POST", "GET"])
# def delete_list():

#     data = request.get_json(force=True)
#     name = data['name']

#     cursor.execute("DELETE FROM List WHERE name='{}'".format(name))
#     conn.commit()

#     cursor.execute("SELECT count(*) from List where name='{}'".format(name))

#     count = cursor.fetchall()[0][0]

#     return {"rec": count}
    
@app.route("/top_5_actor", methods=["GET"])
def top_5_actor():
    cursor.execute("SELECT People.name FROM movie INNER JOIN mp on movie.movie_id=mp.tconst INNER JOIN People ON People.peopleid=mp.nconst GROUP BY People.peopleid ORDER BY COUNT(movie.movie_id) LIMIT 5")
    result = cursor.fetchall()

    result = [i[0] for i in result]

    return {'rec':result}

@app.route("/create_list", methods=["post"])
def create_list():
    data = request.get_json(force=True)
    user = data["user"]
    name = data["list_name"]
    desc = data["description"]
    print("SELECT COUNT(*) from List where name='{}' and creator='{}'".format(name,user))
    cursor.execute("SELECT COUNT(*) from List where name='{}' and creator='{}'".format(name,user) )
    if cursor.fetchall()[0][0]>0:
        return {'rec':0}
    cursor.execute("SELECT MAX(list_id) from List")
    listid = cursor.fetchall()[0][0]
    if listid==None:
        listid =0
    else:
        listid += 1
    print("INSERT INTO List VALUES ('{}','{}','{}','{}')".format(listid, name, desc, user))
    cursor.execute("INSERT INTO List VALUES ('{}','{}','{}','{}')".format(listid, name, desc, user))
    conn.commit()
    return {"rec":{"user_id":user, "list_name":name, "description":desc, "listid":listid}}

@app.route("/add_movie_to_list", methods=["post"])
def add_movie_to_list():
    data = request.get_json(force=True)

    listid = data["list_id"]
    movieid = data["movie_id"]
    try:
        cursor.execute("INSERT INTO list2movie(list_id, movie_id) VALUES ({},'{}')".format(listid, movieid))
        conn.commit()
        return {"rec":1}

    except Exception as e:
        print(e)
        return {"rec":0}

@app.route("/get_list_movie", methods=["post"])
def get_list_movie():
    data = request.get_json(force=True)
    listid = data["list_id"]
    mutex.acquire()
    cursor.execute("SELECT movie.movie_id, movie.title, movie.release_year, movie.runtime,movie.description, movie.cover, movie.production, movie.language, movie.type from movie inner join (SELECT * FROM list2movie where list_id={}) as tmp on movie.movie_id=tmp.movie_id;".format(listid))
    mutex.release()
    result = cursor.fetchall()
    res = []
    for i in result:
        print(i)
        res.append({"movie_id":i[0],
        "title":i[1],
        "release_year":i[2],
        "runtime":i[3],
        "description":i[4],
        "cover":i[5],
        "production":i[6],
        "language":i[7],
        "type":i[8]})

    return {"rec":res}

@app.route("/add_fav_list", methods=["post"])
def add_fav_list():
    data = request.get_json(force=True)
    listid = data["list_id"]
    userid = data["user_id"]
    try:
        cursor.execute("INSERT INTO fav_list(list_id, user) VALUES ({},'{}')".format(listid,userid))
        conn.commit()
        return {"rec":1}
    except Exception as e:


        print(e)
        return {"rec":str(e)}

@app.route("/get_fav_list", methods=["post"])
def get_fav_list():
    data = request.get_json(force=True)
    userid = data["user_id"]
    mutex.acquire()
    cursor.execute("select * from List inner join (select * from fav_list where user='{}') as tmp on List.list_id=tmp.list_id;".format(userid))
 
    result = cursor.fetchall()
    mutex.release()
    res = []
    for i in result:
        res.append({
            "user_id":i[3], "list_name":i[1], "description":i[2], "listid":i[0]
        })
    return {"rec":res}

@app.route("/get_owned_list", methods=["post"])
def get_owned_list():
    data = request.get_json(force=True)
    userid = data["user_id"]
    mutex.acquire()
    cursor.execute("select * from List where creator='{}';".format(userid))
    
    result = cursor.fetchall()
    mutex.release()
    res = []
    for i in result:
        res.append({
            "user_id":i[3], "list_name":i[1], "description":i[2], "listid":i[0]
        })
    return {"rec":res}

@app.route("/randomly_generate_list", methods=["post"])
def randomly_generate_list():
    data = request.get_json(force=True)
    userid = data["user_id"]
    mutex.acquire()
    cursor.execute("select tmp.list_id, tmp.name, movie.title, movie.cover from list2movie INNER JOIN (select * from List where list_id not in (select list_id from fav_list where user='{}') order by Rand() limit 5) as tmp on list2movie.list_id=tmp.list_id INNER JOIN movie on movie.movie_id=list2movie.movie_id".format(userid))
    result = cursor.fetchall()
    mutex.release()

    mutex.acquire()
    cursor.execute("call Result();")
    p_result = cursor.fetchall()
    mutex.release()
    p_res = {}
    for i in p_result:
        p_res[i[0]] = i[2]

    res = {}
    for i in result:
        if i[0] not in res:
            res[i[0]] = {"list_id":i[0], "list_name":i[1],"movie":[i[2]],"cover":i[3]}
            if str(i[0]) in p_res.keys():
                res[i[0]]["level"] = p_res[str(i[0])]
        else:
            res[i[0]]["movie"].append(i[2])
    resc = []
    for i in res:
        if len(res[i]["movie"])>=3:
            res[i]["movie"] = res[i]["movie"][:3]
        else:
            res[i]["movie"]+=[""]*(3-len(res[i]["movie"]))
        resc.append(res[i])
    return {"rec":resc}

@app.route("/randomly_generate_movie", methods=["get"])
def randomly_generate_movie():
    mutex.acquire()
    cursor.execute("select movie.movie_id, movie.title, movie.release_year, movie.runtime,movie.description, movie.cover, movie.production, movie.language,movie.type from movie order by Rand() limit 5")
    result = cursor.fetchall()
    mutex.release()
    res = []
    for i in result:
        res.append({"movie_id":i[0],
        "title":i[1],
        "release_year":i[2],
        "runtime":i[3],
        "description":i[4],
        "cover":i[5],
        "production":i[6],
        "language":i[7],
        "type":i[8]})
    return {"rec":res}
#add for display list info

@app.route("/rating_post",methods=["POST"])
def rating_post():
    data = request.get_json(force=True)
    movie_i = data["movieid"]
    user_i = data["userid"]
    rating_num = data["rating"]
    mutex.acquire()
    cursor.execute("select count(*) from rating where (movie_id, user)=('{}','{}');".format(movie_i, user_i))
    count = cursor.fetchall()[0][0]
    if count > 0:
        cursor.execute("UPDATE rating SET rating.rating = {} where (movie_id, user)=('{}','{}');".format(rating_num, movie_i, user_i))
        conn.commit()
    else:
        cursor.execute("INSERT INTO rating (rating, whether_lucky, movie_id, user) VALUES ({},{},'{}','{}')".format(rating_num, 0, movie_i, user_i))
        conn.commit()
    cursor.execute("select * from rating where (movie_id, user)=('{}','{}');".format(movie_i, user_i))
    result = cursor.fetchall()

    mutex.release()
    ret = {}
    result = list(result[0])
    ret["rating"] = result[2]
    ret["whether_lucky"] = result[3]
    ret["movie_id"] = result[0]
    ret["user_id"] = result[1]
    return {"rec":ret}

@app.route("/edit_rating_post",methods=["POST"])
def edit_rating_post():
    data = request.get_json(force=True)
    movie_i = data["movieid"]
    user_i = data["userid"]
    rating_num = data["rating"]
    mutex.acquire()
    
    cursor.execute("select * from rating where (movie_id, user)=('{}','{}');".format(movie_i, user_i))
    result = cursor.fetchall()
    mutex.release()
    ret = {}
    result = list(result[0])
    ret["rating"] = result[0]
    ret["whether_lucky"] = result[1]
    ret["movie_id"] = result[2]
    ret["user_id"] = result[3]
    return {"rec":ret}

@app.route("/pro", methods=["POST", "GET"])
def pro():
    PROCEDURE = """
DROP PROCEDURE IF EXISTS Result;//
DELIMITER //

CREATE PROCEDURE Result()
BEGIN
    DECLARE userName_cursor VARCHAR(255);
    DECLARE ucount_cursor INT;
    DECLARE a INT;
    
    DECLARE level_1 CURSOR FOR
    SELECT DISTINCT list_id, ctemp FROM List LEFT JOIN
    (SELECT creator, COUNT(list_id) as ctemp FROM List GROUP BY creator) as tmp on List.creator = tmp.creator;

    DECLARE level_2 CURSOR FOR
    SELECT DISTINCT list_id, ctemp FROM List LEFT JOIN
    (SELECT user, COUNT(list_id) as ctemp FROM fav_list GROUP BY user) as tmp on List.creator = tmp.user;

    DECLARE level_3 CURSOR FOR
    SELECT DISTINCT list_id, ctemp FROM List LEFT JOIN
    (SELECT creator, COUNT(list_id) as ctemp FROM List GROUP BY creator) as tmp on List.creator = tmp.creator;
    
    DROP TABLE IF EXISTS level_Table;
    
    CREATE TABLE level_Table(
        username VARCHAR(255),
        levelStatus INT,
        level VARCHAR(255)
    );
    
    OPEN level_1;
    BEGIN
        DECLARE done INT DEFAULT 0;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
        REPEAT
            FETCH level_1 INTO userName_cursor, ucount_cursor;
            INSERT IGNORE INTO level_Table VALUES(userName_cursor, ucount_cursor, "");
        UNTIL done
        END REPEAT;
    CLOSE level_1;
    END;

    OPEN level_2;
    BEGIN
        DECLARE done INT DEFAULT 0;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
        REPEAT
            FETCH level_2 INTO userName_cursor, ucount_cursor;
            UPDATE level_Table SET levelStatus = levelStatus + ucount_cursor WHERE level_Table.username = userName_cursor;
        UNTIL done
        END REPEAT;
    CLOSE level_2;
    END;

    OPEN level_3;
    BEGIN
        DECLARE done INT DEFAULT 0;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
        REPEAT
            FETCH level_3 INTO userName_cursor, ucount_cursor;
            UPDATE level_Table SET levelStatus = levelStatus + ucount_cursor WHERE level_Table.username = userName_cursor;
            SET a = (SELECT MAX(levelStatus) FROM level_Table WHERE username = userName_cursor);
            IF a <= 1 THEN
            UPDATE level_Table SET level = "platinum" WHERE username = userName_cursor;
            ELSEIF a > 10 THEN
            UPDATE level_Table SET level = "pro" WHERE username = userName_cursor;
            ELSE UPDATE level_Table SET level = "gold" WHERE username = userName_cursor;
            END IF;
        UNTIL done
        END REPEAT;
    CLOSE level_3;
    END;
    
    SELECT DISTINCT * FROM level_Table ORDER BY username ASC;

    DROP TABLE IF EXISTS level_Table;
END;
//
    """

    TRIGGER = """
/*!50003 CREATE*/ /*!50003 TRIGGER date_overlap_insert_start_date
BEFORE INSERT ON rating
        FOR EACH ROW
    BEGIN
        SET @discount = (SELECT COUNT(*)
                         FROM rating
        );
        IF MOD(@discount, 3) = 0 THEN SET new.whether_lucky = 1, new.rating = new.rating * 2;
        END IF;
    END; */
    """

    mutex.acquire()
    cursor.execute("call Result();")
    mutex.release()
    result = cursor.fetchall()
    return {"rec":result}


@app.route("/get_list_by_id",methods=["POST"])
def get_list_by_id():
    data = request.get_json(force=True)
    listid = data["list_id"]
    mutex.acquire()
    cursor.execute("select * from List where list_id='{}';".format(listid))
    result = cursor.fetchall()
    mutex.release()
    ret = {}
    result = list(result[0])
    ret["listid"] = result[0]
    ret["list_name"] = result[1]
    ret["description"] = result[2]
    ret["user_id"] = result[3]
    # for i in result:
    #     res.append({
    #         "user_id":i[3], "list_name":i[1], "description":i[2], "listid":i[0]
    #     })
    return {"rec":ret}

if __name__ == '__main__':
    app.run(port=8000, debug=True)
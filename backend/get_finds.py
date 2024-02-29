import sqlite3

def get_finds():
    findlist = []

    #establish database connection
    con = sqlite3.connect("../database/shroomscout")
    cur = con.cursor()
    cur.execute("SELECT * FROM findLog")
    rows = cur.fetchall()
    columns = [column[0] for column in cur.description]
    
    #append each row to findList as a dictionary
    for row in rows:
        row_dict = dict(zip(columns, row))
        findlist.append(row_dict)
    con.close()
    
    #enclose array of objects in another object in order to meet json standards 
    #and enable sending metadata in the future
    return {"data": findlist}

if __name__ == "__main__":
    print(get_finds())
import os

option = input("You are about to reset your full database. Continue? ")

if (option != "yes" or option != "y"):
  print("You decided not to continue.")

print("In this case I need some details.")

username = input("Enter your database username: ")
password = input("Enter your database password (blank for no password): ")
database = input("Enter your database name: ")

if (password != ""):
  os.system("PGPASSWORD = " + password)

baseCommand = "psql -U " + username + " -d " + database

# Drop all tables
dropAll = baseCommand + " < DropAll.sql"
os.system(dropAll)

# Create all from new
createAll = baseCommand + " < MainSchema.sql"
os.system(createAll)

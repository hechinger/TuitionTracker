import csv
from collections import OrderedDict
import json

# Print a test to make sure it's working
print("hello")

# Run 'cat dump.py' to debug/see if anything in dump.py loads in terminal

# Read the .csv file
data = csv.DictReader(open("merged-dataset-2025.csv","r"))

# Function to print "null" for no info
def convertInt(value):
    print(value)
    if value is None or value == '' or value == 'null':
        return 0
    else:
        try:
            return int(float(value))
        except ValueError as e:
            print('Error is: ' + str(e))
            return 1

def parseFloat(num):
    if num is None or num == 'null':
        return None
    else:
        try:
            return float(num)
        except ValueError:
            return None

# Loop through each record and output a file by unitid
for row in data:
    institution = OrderedDict()
    # if row['UnitID'] == '126182':
    #     print row["Multiplier (income 0-30 000)-students awarded Title IV federal financial aid"]

    institution['unitid'] = row['UnitID']
    institution['institution'] = row['Institution Name']
    institution['alias'] = row['Institution name alias (HD2023)'] # 
    institution['city'] = row['city'] 
    institution['abbreviation'] = row['abbreviation'] 
    institution['hbcu'] = convertInt(row['hbcu'])
    institution['tribal_college'] = convertInt(row['tribal_college'])
    institution['level'] = convertInt(row['Sector of institution (HD2023)'])

    perc_sticker = parseFloat(row['perc_sticker'])
    if perc_sticker is not None:
        perc_sticker = perc_sticker / 100
    enrollment = [
        ('perc_sticker', perc_sticker),
        ('perc_admitted', parseFloat(row['perc_admitted'])),
        ("enrollment_unknown",convertInt(row['enrollment_unknown'])),
        ("enrollment_twomore",convertInt(row['enrollment_twomore'])),
        ("enrollment_white",convertInt(row['enrollment_white'])),
        ("enrollment_hisp",convertInt(row['enrollment_hisp'])),
        ("enrollment_nathawpacisl",convertInt(row['enrollment_nathawpacisl'])),
        ("enrollment_black",convertInt(row['enrollment_black'])),
        ("enrollment_asian",convertInt(row['enrollment_asian'])),
        ("enrollment_amerindalasknat",convertInt(row['enrollment_amerindalasknat'])),
        ("enrollment_nonresident",convertInt(row['enrollment_nonresident'])),
        ("total_men",parseFloat(row['total_men'])),
        ("total_women",parseFloat(row['total_women'])),
        ("total_enrollment",parseFloat(row['total_enrollment'])),
        ("total_genderunknown",parseFloat(row['total_genderunknown'])),  # new 2024
        ("total_anothergender",parseFloat(row['total_anothergender']))   # new 2024
    ]

    institution["enrollment"] = OrderedDict(enrollment)

    # Find the year in row headers
    # Build a JSON array based on the the yearly data for each school

    years_list_25_26 = [
        ("year","25-26"),

        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_2526"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_2526"])),
        ("price_oostate_oncampus",parseFloat(row["price_oostate_oncampus_2526"])),
        ("price_oostate_offcampus_nofamily",parseFloat(row["price_oostate_offcampus_nofamily_2526"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_2526"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_2526"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_2526"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_2526"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_2526"])),

        ("min_max_diff_0_30000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_0_30000_campus"])),
        ("min_max_diff_30001_48000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_30001_48000_campus"])),
        ("min_max_diff_48001_75000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_48001_75000_campus"])),
        ("min_max_diff_75001_110000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_75001_110000_campus"])),
        ("min_max_diff_110001_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_110001_campus"])),

        ("min_max_diff_0_30000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_0_30000_offcampus"])),
        ("min_max_diff_30001_48000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_30001_48000_offcampus"])),
        ("min_max_diff_48001_75000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_48001_75000_offcampus"])),
        ("min_max_diff_75001_110000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_75001_110000_offcampus"])),
        ("min_max_diff_110001_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_110001_offcampus"])),
    ]

    years_list_24_25 = [
        ("year","24-25"),

        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_2425"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_2425"])),
        ("price_oostate_oncampus",parseFloat(row["price_oostate_oncampus_2425"])),
        ("price_oostate_offcampus_nofamily",parseFloat(row["price_oostate_offcampus_nofamily_2425"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_2425"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_2425"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_2425"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_2425"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_2425"])),

         ("min_max_diff_0_30000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_0_30000_campus"])),
        ("min_max_diff_30001_48000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_30001_48000_campus"])),
        ("min_max_diff_48001_75000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_48001_75000_campus"])),
        ("min_max_diff_75001_110000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_75001_110000_campus"])),
        ("min_max_diff_110001_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_110001_campus"])),

        ("min_max_diff_0_30000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_0_30000_offcampus"])),
        ("min_max_diff_30001_48000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_30001_48000_offcampus"])),
        ("min_max_diff_48001_75000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_48001_75000_offcampus"])),
        ("min_max_diff_75001_110000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_75001_110000_offcampus"])),
        ("min_max_diff_110001_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_110001_offcampus"])),
    ]

    years_list_23_24 = [
        ("year","23-24"),

        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_2324"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_2324"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_2324"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_2324"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_2324"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_2324"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_2324"])),

        ("min_max_diff_0_30000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_0_30000_campus"])),
        ("min_max_diff_30001_48000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_30001_48000_campus"])),
        ("min_max_diff_48001_75000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_48001_75000_campus"])),
        ("min_max_diff_75001_110000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_75001_110000_campus"])),
        ("min_max_diff_110001_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_110001_campus"])),

        ("min_max_diff_0_30000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_0_30000_offcampus"])),
        ("min_max_diff_30001_48000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_30001_48000_offcampus"])),
        ("min_max_diff_48001_75000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_48001_75000_offcampus"])),
        ("min_max_diff_75001_110000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_75001_110000_offcampus"])),
        ("min_max_diff_110001_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_110001_offcampus"])),
    ]

    years_list_22_23 = [
        ("year","22-23"),

        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_2223"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_2223"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_2223"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_2223"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_2223"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_2223"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_2223"])),
        ("min_max_diff_0_30000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_0_30000_campus"])),
        ("min_max_diff_30001_48000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_30001_48000_campus"])),
        ("min_max_diff_48001_75000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_48001_75000_campus"])),
        ("min_max_diff_75001_110000_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_75001_110000_campus"])),
        ("min_max_diff_110001_titleiv_privateforprofit_campus",json.loads(row["min_max_diff_110001_campus"])),

        ("min_max_diff_0_30000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_0_30000_offcampus"])),
        ("min_max_diff_30001_48000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_30001_48000_offcampus"])),
        ("min_max_diff_48001_75000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_48001_75000_offcampus"])),
        ("min_max_diff_75001_110000_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_75001_110000_offcampus"])),
        ("min_max_diff_110001_titleiv_privateforprofit_offcampus",json.loads(row["min_max_diff_110001_offcampus"])),
    ]

    years_list_21_22 = [
        ("year","21-22"),

        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_2122"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_2122"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_2122"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_2122"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_2122"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_2122"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_2122"]))
    ]

    years_list_20_21 = [
        ("year","20-21"),
        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_2021"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_2021"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_2021"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_2021"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_2021"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_2021"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_2021"])),
    ]

    years_list_19_20 = [
        ("year","19-20"),
        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_1920"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_1920"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_1920"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_1920"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_1920"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_1920"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_1920"])),
        ("grad_rate_associate_3years_total",parseFloat(row["grad_rate_total"])),
        ("grad_rate_bachelors_6years_total",parseFloat(row["grad_rate_total"])),

        ("grad_rate_associate_3years_white",parseFloat(row["grad_rate_white"])),
        ("grad_rate_associate_3years_black",parseFloat(row["grad_rate_black"])),
        ("grad_rate_associate_3years_hisp",parseFloat(row["grade_rate_hisp"])),
        ("grad_rate_associate_3years_amerindalasknat",parseFloat(row["grad_rate_amerindalasknat"])),
        ("grad_rate_associate_3years_unknown",parseFloat(row["grad_rate_unknown"])),
        ("grad_rate_associate_3years_asian",parseFloat(row["grad_rate_asian"])),
        ("grad_rate_associate_3years_nathawpacisl",parseFloat(row["grad_rate_nathawpacisl"])),
        ("grad_rate_associate_3years_twomore",parseFloat(row["grad_rate_twomore"])),
        ("grad_rate_associate_3years_total",parseFloat(row["grad_rate_total"])),

        ("grad_rate_bachelors_6years_white",parseFloat(row["grad_rate_white"])),
        ("grad_rate_bachelors_6years_black",parseFloat(row["grad_rate_black"])),
        ("grad_rate_bachelors_6years_hisp",parseFloat(row["grade_rate_hisp"])),
        ("grad_rate_bachelors_6years_amerindalasknat",parseFloat(row["grad_rate_amerindalasknat"])),
        ("grad_rate_bachelors_6years_unknown",parseFloat(row["grad_rate_unknown"])),
        ("grad_rate_bachelors_6years_asian",parseFloat(row["grad_rate_asian"])),
        ("grad_rate_bachelors_6years_nathawpacisl",parseFloat(row["grad_rate_nathawpacisl"])),
        ("grad_rate_bachelors_6years_twomore",parseFloat(row["grad_rate_twomore"])),

        ("full_time_retention_rate",parseFloat(row["full_time_retention_rate"])),
        ("part_time_retention_rate",parseFloat(row["part_time_retention_rate"]))
    ]

    years_list_18_19 = [
        ("year","18-19"),
        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_1819"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily1819"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_1819"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_1819"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_1819"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_1819"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_1819"])),
    ]

    years_list_17_18 = [
        ("year","17-18"),
        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_1718"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_1718"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_1718"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_1718"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_1718"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_1718"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_1718"])),
    ]
   
    years_list_16_17 = [
        ("year","16-17"),
        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_1617"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_1617"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_1617"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_1617"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_1617"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_1617"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_1617"])),
    ]

    years_list_15_16 = [
        ("year","15-16"),
        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_1516"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_1516"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_1516"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_1516"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_1516"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_1516"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_1516"])),
    ]

    years_list_14_15 = [
        ("year","14-15"),
        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_1415"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_1415"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_1415"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_1415"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_1415"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_1415"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_1415"])),
    ]

    years_list_13_14 = [
        ("year","13-14"),
        ("price_instate_oncampus",parseFloat(row["price_instate_oncampus_1314"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["price_instate_offcampus_nofamily_1314"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_1314"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_1314"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_1314"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_1314"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_1314"])),
    ]

    years_list_12_13 = [
        ("year","12-13"),
        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["avg_net_price_0_30000_1213"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["avg_net_price_30001_48000_1213"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["avg_net_price_48001_75000_1213"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["avg_net_price_75001_110000_1213"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["avg_net_price_110001_1213"])),
    ]

    institution["yearly_data"] = OrderedDict(years_list_25_26),OrderedDict(years_list_24_25),OrderedDict(years_list_23_24),OrderedDict(years_list_22_23),OrderedDict(years_list_21_22),OrderedDict(years_list_20_21),OrderedDict(years_list_19_20),OrderedDict(years_list_18_19),OrderedDict(years_list_17_18),OrderedDict(years_list_16_17),OrderedDict(years_list_15_16),OrderedDict(years_list_14_15),OrderedDict(years_list_13_14),OrderedDict(years_list_12_13)

    # Dump the contents of each row
    data_file = json.dumps(institution, indent=4, separators=(',', ': '))

    # write a JSON file for each one named UnitID.json
    outfile = open("school-data-2025/{}.json".format(row["UnitID"]), "w")
    outfile.write(data_file)

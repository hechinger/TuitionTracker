import xml.etree.cElementTree as ET
from datetime import datetime
import os


def generate_sitemap():

    schema_loc = ("http://www.sitemaps.org/schemas/sitemap/0.9 "
                  "http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd")

    root = ET.Element("urlset")
    root.attrib['xmlns:xsi'] = 'http://www.w3.org/2001/XMLSchema-instance'
    root.attrib['xsi:schemaLocation'] = schema_loc
    root.attrib['xmlns'] = "http://www.sitemaps.org/schemas/sitemap/0.9"

    _url = "https://tuitiontracker.org/"
    dt = datetime.now().strftime("%Y-%m-%d")

    doc = ET.SubElement(root, "url")
    ET.SubElement(doc, "loc").text = _url
    ET.SubElement(doc, "lastmod").text = dt
    ET.SubElement(doc, "changefreq").text = 'weekly'
    ET.SubElement(doc, "priority").text = "1.0"

    schools = os.listdir(r"src/data/school-data-09042019")

    for school in schools:
        school = school.split('.', 1)[0]
        print(school)
        doc = ET.SubElement(root, "url")
        ET.SubElement(doc, "loc").text = f"{_url}school.html?unitid={school}"
        ET.SubElement(doc, "lastmod").text = dt
        ET.SubElement(doc, "changefreq").text = 'monthly'
        ET.SubElement(doc, "priority").text = "0.8"

    tree = ET.ElementTree(root)
    ET.indent(tree, '  ')
    tree.write("sitemap.xml",
               encoding='utf-8', xml_declaration=True)


generate_sitemap()

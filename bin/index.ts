#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { readFileSync } from 'fs'

import Product from '../src/models/product'

import Database from '../src/services/Database.service'

yargs(hideBin(process.argv))
  .command('products_load', 'Loads all the products in data/products.json on the DB ', () => {}, async (argv) => {
    Database.connect()
    const products = JSON.parse(readFileSync('./data/products.json').toString())
    for (const product of products) await Product.upsert(product)
    Database.close()
  })
  .demandCommand(1)
  .parse()
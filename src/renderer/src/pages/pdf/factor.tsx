import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { Customer, Factor } from '@/types/factors'
import { digitsEnToFa } from '@persian-tools/persian-tools'
import { type_docs } from '@/constant/factor'
import jalaaliMoment from '@/utils/date'
import IransansFontBold from '@/assets/fonts/iransans/IRANSansWeb_Bold.ttf'
import IransansFont from '@/assets/fonts/iransans/IRANSansWeb.ttf'
import Logo from '@/assets/images/logo.png'
Font.register({
  family: 'IRANSans',
  fonts: [
    {
      src: IransansFont,
      fontStyle: 'normal',
      fontWeight: 'normal'
    },
    {
      src: IransansFontBold,
      fontStyle: 'normal',
      fontWeight: 'bold'
    },
    {
      src: IransansFontBold,
      fontStyle: 'italic',
      fontWeight: 'bold'
    }
  ]
})

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    height: '100%',
    fontSize: '6px',
    fontFamily: 'IRANSans'
  }
})

// Create Document Component
export const FactorPDF = ({ factor, customer }: { factor: Factor; customer: Customer }) => (
  <Document>
    <Page size="A5" style={styles.page}>
      <View
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',

          alignItems: 'center',
          rowGap: '20px',
          justifyContent: 'center'
        }}
      >
        <Image
          style={{ width: '60px', height: '60px', objectFit: 'contain', marginTop: '-60px' }}
          source={Logo}
        />
        <View
          style={{
            width: '80%',
            border: '1px black solid',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <View
            style={{
              width: '100%',
              border: '1px black solid',
              display: 'flex',
              flexDirection: 'row',
              padding: '10px',
              justifyContent: 'flex-end',
              borderRight: 'none',
              borderTop: 'none',
              borderLeft: 'none'
            }}
          >
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                rowGap: '10px'
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  rowGap: '10px'
                }}
              >
                <Text style={{ textAlign: 'right' }}>
                  تلفن: {customer.telephone ? digitsEnToFa(customer.telephone) : 'ندارد'}
                </Text>
                <Text>
                  موبایل: {customer.phone_number ? digitsEnToFa(customer.phone_number) : 'ندارد'}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                rowGap: '10px',
                alignItems: 'flex-end'
              }}
            >
              <Text>آدرس: {customer.address ?? 'ندارد'}</Text>
              <Text>حساب بانکی: {customer.card_id ? digitsEnToFa(customer.card_id) : 'ندارد'}</Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              border: '1px black solid',
              display: 'flex',
              flexDirection: 'row',
              padding: '10px',
              justifyContent: 'flex-end',
              borderTop: 'none',
              borderRight: 'none',
              borderLeft: 'none'
            }}
          >
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                rowGap: '10px',
                marginTop: '-1px'
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  rowGap: '10px'
                }}
              >
                <Text style={{ textAlign: 'right' }}>
                  تاریخ: {digitsEnToFa(jalaaliMoment(factor.date).format('jYYYY/jMM/jDD'))}
                </Text>
                <Text>توسط: {factor.from ?? 'ندارد'}</Text>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                rowGap: '10px',
                marginTop: '-1px'
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  rowGap: '10px'
                }}
              >
                <Text style={{ textAlign: 'right' }}>شهر: {customer.city ?? 'ندارد'}</Text>
                <Text>نوع سند: {type_docs[factor.type_doc]}</Text>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                rowGap: '10px',
                alignItems: 'flex-end'
              }}
            >
              <Text>صورت حساب: {customer.full_name ?? 'ندارد'}</Text>
              <Text>شماره سند: {factor.id ? digitsEnToFa(factor.document_id) : 'ندارد'}</Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: '30vh',
              border: '1px black solid',
              borderLeft: 'none',
              borderRight: 'none',
              marginTop: '-1px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                width: '100%'
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '5px',
                  flex: '3',
                  padding: '5px 0px',
                  alignItems: 'center',
                  width: '100%',
                  borderRight: '1px black solid'
                }}
              >
                <Text>فی کل</Text>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
              <View style={{display:"flex",flexDirection:"row",columnGap:"1px"}} >
                  
                  
                  <Text >
                  
                  تومان
                  
                  
                </Text>
                {" "}
                  <Text >
                  
                  {digitsEnToFa(
                    Intl.NumberFormat().format(Math.ceil(factor.quote / 4.6083) * Number(factor.weight))
                  )}
                  
                  
                </Text>
                
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '5px',
                  flex: '2',
                  padding: '5px 0px',
                  alignItems: 'center',
                  width: '100%',
                  borderRight: '1px black solid'
                }}
              >
                <Text>فی</Text>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
                <View style={{display:"flex",flexDirection:"row",columnGap:"1px"}} >
                  
                  
                  <Text >
                  
                  تومان
                  
                  
                </Text>
                {" "}
                  <Text >
                  
                  {digitsEnToFa(Intl.NumberFormat().format(Math.ceil(factor.quote / 4.6083)))}
                  
                  
                </Text>
                
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '5px',
                  padding: '5px 0px',
                  flex: '1',
                  alignItems: 'center',
                  width: '100%',
                  borderRight: '1px black solid'
                }}
              >
                <Text>عیار</Text>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
                <Text>۹۹۵+</Text>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  rowGap: '5px',
                  padding: '5px 0px',
                  width: '100%',
                  flex: '2',
                  borderRight: '1px black solid'
                }}
              >
                <Text>وزن</Text>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
                <View style={{display:"flex",flexDirection:"row",columnGap:"1px"}} >
                  
                  
                  <Text >
                  
                  گرم
                  
                  
                </Text>
                {" "}
                  <Text >
                  
                  {digitsEnToFa(factor.weight)}
                  
                  
                </Text>
                
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '5px',
                  padding: '5px 0px',
                  alignItems: 'center',
                  flex: '2',
                  width: '100%',
                  borderRight: '1px black solid'
                }}
              >
                <Text>شرح</Text>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
                <Text>نقره ساچمه</Text>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '5px',
                  padding: '5px 0px',
                  alignItems: 'center',
                  flex: '1',
                  width: '100%'
                }}
              >
                <Text>ردیف</Text>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
                <Text>۱</Text>
                <View
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'black'
                  }}
                ></View>
              </View>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <View
              style={{
                width: '100%',
                display: 'flex',
                flex: '2',
                flexDirection: 'column',
                alignItems: 'flex-start',
                borderRight: '1px black solid'
              }}
            >
              <View
                style={{
                  width: '100%',
                  borderBottom: '1px black solid',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  padding: '2px'
                }}
              >
                <Text>جمع سند: {digitsEnToFa(Intl.NumberFormat().format(Number(factor.weight)))} گرم</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  padding: '2px'
                }}
              >
                <Text>
                  جمع مبلغ:{' '}
                  {digitsEnToFa(
                    Intl.NumberFormat().format(Math.ceil(factor.quote / 4.6083) *Number(factor.weight))
                  )}{' '}
                  تومان
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                alignItems: 'flex-start',
                borderRight: '1px black solid'
              }}
            >
              <View
                style={{
                  width: '100%',
                  borderBottom: '1px black solid',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  padding: '2px'
                }}
              >
                <Text>جمع وزن: {digitsEnToFa(Intl.NumberFormat().format(Number(factor.weight)))} گرم</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  padding: '2px'
                }}
              >
                <Text>
                  وزن با پلاستیک:{' '}
                  {digitsEnToFa(Intl.NumberFormat().format(Number(factor.weight_with_plastic)))} گرم
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                alignItems: 'flex-start'
              }}
            >
              <View
                style={{
                  width: '100%',
                  borderBottom: '1px black solid',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  padding: '2px'
                }}
              >
                <Text>مثقال: {digitsEnToFa(Intl.NumberFormat().format(factor.quote))} تومان</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  padding: '2px'
                }}
              >
                <Text>
                  {' '}
                  گرم: {digitsEnToFa(
                    Intl.NumberFormat().format(Math.ceil(factor.quote / 4.6083))
                  )}{' '}
                  تومان
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)
